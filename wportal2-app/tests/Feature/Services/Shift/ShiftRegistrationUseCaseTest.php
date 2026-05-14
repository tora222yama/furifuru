<?php

declare(strict_types=1);

namespace Tests\Feature\Services\Shift;

use App\Enum\App\ECalendarSyncStatus;
use App\Services\Shift\Domain\ShiftCalendarSyncer;
use App\Services\Shift\Domain\ShiftStartSettings;
use App\Services\Shift\UseCase\ShiftRegistrationCommand;
use App\Services\Shift\UseCase\ShiftRegistrationUseCase;
use Google\Service\Calendar\Event;
use InvalidArgumentException;
use Tests\Fakes\External\FakeGoogleCalendarService;
use Tests\Fakes\Shift\FakeShiftScheduleRepository;
use Tests\Fakes\Shift\FakeShiftSettingsRepository;
use Tests\TestCase;

final class ShiftRegistrationUseCaseTest extends TestCase
{
    private function makeUseCase(
        ?FakeGoogleCalendarService $calendarService = null,
        ?FakeShiftScheduleRepository $repository = null,
        ?FakeShiftSettingsRepository $settingsRepository = null,
    ): ShiftRegistrationUseCase {
        $calendarService ??= new FakeGoogleCalendarService;

        return new ShiftRegistrationUseCase(
            new ShiftCalendarSyncer($calendarService),
            $repository         ?? new FakeShiftScheduleRepository,
            $settingsRepository ?? new FakeShiftSettingsRepository,
        );
    }

    public function test_execute_returns_empty_result_when_no_shifts(): void
    {
        $fakeCalendar    = new FakeGoogleCalendarService;
        $fakeRepository  = new FakeShiftScheduleRepository;
        $useCase         = $this->makeUseCase($fakeCalendar, $fakeRepository);

        $command         = new ShiftRegistrationCommand(trnUserId: 1, authEmail: 'user@example.com', shifts: [], startSettings: ShiftStartSettings::default());

        $result          = $useCase->execute($command);

        $this->assertSame(0, $result->successes->count());
        $this->assertSame(0, $result->failures->count());
        $this->assertSame([], $fakeCalendar->deleteCalls);
        $this->assertSame([], $fakeCalendar->blockCalls);
        $this->assertSame([], $fakeRepository->replaceMonthlyShiftsCalls);
    }

    public function test_execute_saves_to_db_and_syncs_all_shifts(): void
    {
        $fakeCalendar                                              = new FakeGoogleCalendarService;
        $fakeRepository                                            = new FakeShiftScheduleRepository;
        $useCase                                                   = $this->makeUseCase($fakeCalendar, $fakeRepository);

        $command                                                   = new ShiftRegistrationCommand(1, 'user@example.com', [
            ['date' => '2024-07-01', 'type' => 'office'],
            ['date' => '2024-07-02', 'type' => 'remote'],
        ], ShiftStartSettings::default());

        $result                                                    = $useCase->execute($command);

        $this->assertSame(2, $result->successes->count());
        $this->assertSame(0, $result->failures->count());

        // DBへの保存が呼ばれていること
        $this->assertCount(1, $fakeRepository->replaceMonthlyShiftsCalls);
        $this->assertSame(1, $fakeRepository->replaceMonthlyShiftsCalls[0]['trnUserId']);
        $this->assertSame(2, $fakeRepository->replaceMonthlyShiftsCalls[0]['shifts']->count());

        // 全件成功で SYNCED に更新されていること
        $this->assertCount(1, $fakeRepository->updateSyncStatusesCalls);
        $this->assertSame(ECalendarSyncStatus::SYNCED, $fakeRepository->updateSyncStatusesCalls[0]['status']);

        // Google Calendar の削除・登録が呼ばれていること
        $this->assertCount(1, $fakeCalendar->deleteCalls);
        $deleteCall                                                = $fakeCalendar->deleteCalls[0];
        $this->assertSame('user@example.com', $deleteCall['authEmail']);
        $this->assertSame('2024-07-01', $deleteCall['start']->toDateString());
        $this->assertSame('2024-07-31', $deleteCall['end']->toDateString());

        $this->assertCount(4, $fakeCalendar->blockCalls); // 2 shifts x (all-day + timed)

        [$allDayOffice, $timedOffice, $allDayRemote, $timedRemote] = $fakeCalendar->blockCalls;

        $this->assertSame('オフィス出社', $allDayOffice['summary']);
        $this->assertSame('shift_sync', $allDayOffice['source']);
        $this->assertSame('出勤（オフィス）', $timedOffice['summary']);

        $this->assertSame('在宅', $allDayRemote['summary']);
        $this->assertSame('shift_sync', $allDayRemote['source']);
        $this->assertSame('出勤（在宅）', $timedRemote['summary']);
    }

    public function test_execute_marks_shift_as_failure_when_blocking_fails(): void
    {
        $fakeCalendar    = new FakeGoogleCalendarService(throwOnBlockCallIndices: [1]);
        $fakeRepository  = new FakeShiftScheduleRepository;
        $useCase         = $this->makeUseCase($fakeCalendar, $fakeRepository);

        $command         = new ShiftRegistrationCommand(1, 'user@example.com', [
            ['date' => '2024-07-10', 'type' => 'office'],
        ], ShiftStartSettings::default());

        $result          = $useCase->execute($command);

        $this->assertSame(0, $result->successes->count());
        $this->assertSame(1, $result->failures->count());

        // DBへの保存は成功していること
        $this->assertCount(1, $fakeRepository->replaceMonthlyShiftsCalls);

        // 失敗分が FAILED に更新されていること
        $failedUpdates   = array_filter(
            $fakeRepository->updateSyncStatusesCalls,
            fn (array $call): bool => $call['status'] === ECalendarSyncStatus::FAILED,
        );
        $this->assertCount(1, $failedUpdates);

        $this->assertCount(1, $fakeCalendar->deleteCalls);
        $this->assertCount(2, $fakeCalendar->blockCalls);
    }

    public function test_execute_does_not_throw_when_calendar_has_null_extended_properties_event(): void
    {
        // extendedProperties が null のイベント（外部から登録された通常の Google Calendar 予定）と
        // シフト同期イベントが混在するケースを再現する。
        $nullExtPropsEvent    = new Event;
        // extendedProperties を設定しない → getExtendedProperties() が null を返す

        $shiftEvent           = new Event;
        $extProps             = new \Google\Service\Calendar\EventExtendedProperties;
        $extProps->setShared(['source' => 'shift_sync']);
        $shiftEvent->setExtendedProperties($extProps);

        $fakeCalendar         = new FakeGoogleCalendarService;
        $fakeCalendar->seedListScheduleEvents([$nullExtPropsEvent, $shiftEvent]);
        $fakeRepository       = new FakeShiftScheduleRepository;
        $useCase              = $this->makeUseCase($fakeCalendar, $fakeRepository);

        $command              = new ShiftRegistrationCommand(1, 'user@example.com', [
            ['date' => '2024-07-01', 'type' => 'office'],
        ], ShiftStartSettings::default());

        // extendedProperties が null のイベントが混在していても例外なく完了すること
        $result               = $useCase->execute($command);

        $this->assertSame(1, $result->successes->count());
        $this->assertSame(0, $result->failures->count());

        // source=shift_sync のイベントのみ削除対象となっていること
        $this->assertCount(1, $fakeCalendar->deletedEvents);
        $extProps             = $fakeCalendar->deletedEvents[0]->getExtendedProperties();
        // getExtendedProperties() は PHPDoc 上 non-nullable だが実際は null を返す場合があるため instanceof で確認
        // @phpstan-ignore instanceof.alwaysTrue
        $deletedShared        = $extProps instanceof \Google\Service\Calendar\EventExtendedProperties ? $extProps->getShared() : [];
        $this->assertSame('shift_sync', $deletedShared['source'] ?? null);

        // 新規シフトは正常に登録されていること（1 shift x (all-day + timed)）
        $this->assertCount(2, $fakeCalendar->blockCalls);
    }

    public function test_execute_throws_when_shifts_spread_over_multiple_months(): void
    {
        $fakeCalendar    = new FakeGoogleCalendarService;
        $fakeRepository  = new FakeShiftScheduleRepository;
        $useCase         = $this->makeUseCase($fakeCalendar, $fakeRepository);

        $command         = new ShiftRegistrationCommand(1, 'user@example.com', [
            ['date' => '2024-07-31', 'type' => 'office'],
            ['date' => '2024-08-01', 'type' => 'remote'],
        ], ShiftStartSettings::default());

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('All shifts must belong to the same month');

        $useCase->execute($command);
    }
}
