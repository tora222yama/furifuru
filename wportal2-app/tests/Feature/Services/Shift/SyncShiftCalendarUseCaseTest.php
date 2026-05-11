<?php

declare(strict_types=1);

namespace Tests\Feature\Services\Shift;

use App\Enum\App\ECalendarSyncStatus;
use App\Services\Shift\Domain\ShiftCalendarSyncer;
use App\Services\Shift\Domain\ShiftEntries;
use App\Services\Shift\Domain\ShiftStartSettings;
use App\Services\Shift\UseCase\SyncShiftCalendarCommand;
use App\Services\Shift\UseCase\SyncShiftCalendarUseCase;
use Carbon\CarbonImmutable;
use Tests\Fakes\External\FakeGoogleCalendarService;
use Tests\Fakes\Shift\FakeShiftScheduleRepository;
use Tests\Fakes\Shift\FakeShiftSettingsRepository;
use Tests\TestCase;

final class SyncShiftCalendarUseCaseTest extends TestCase
{
    private function makeUseCase(
        ?FakeGoogleCalendarService $calendarService = null,
        ?FakeShiftScheduleRepository $repository = null,
        ?FakeShiftSettingsRepository $settingsRepository = null,
    ): SyncShiftCalendarUseCase {
        $calendarService ??= new FakeGoogleCalendarService;

        return new SyncShiftCalendarUseCase(
            new ShiftCalendarSyncer($calendarService),
            $repository         ?? new FakeShiftScheduleRepository,
            $settingsRepository ?? new FakeShiftSettingsRepository,
        );
    }

    private function makeCommand(string $month = '2024-07'): SyncShiftCalendarCommand
    {
        return new SyncShiftCalendarCommand(
            trnUserId: 1,
            authEmail: 'user@example.com',
            targetMonth: CarbonImmutable::parse($month.'-01')->startOfMonth(),
        );
    }

    public function test_execute_returns_empty_result_when_no_shifts_in_db(): void
    {
        $fakeCalendar   = new FakeGoogleCalendarService;
        $fakeRepository = new FakeShiftScheduleRepository;
        $useCase        = $this->makeUseCase($fakeCalendar, $fakeRepository);

        // 対象月にシフトなし → 空を返す
        $command        = $this->makeCommand('2024-07');

        $result         = $useCase->execute($command);

        $this->assertSame(0, $result->successes->count());
        $this->assertSame(0, $result->failures->count());
        $this->assertSame([], $fakeCalendar->deleteCalls);
        $this->assertSame([], $fakeCalendar->blockCalls);
        $this->assertSame([], $fakeRepository->updateSyncStatusesCalls);
        $this->assertCount(1, $fakeRepository->getMonthlyShiftsCalls);
        $this->assertSame('2024-07', $fakeRepository->getMonthlyShiftsCalls[0]['targetMonth']->format('Y-m'));
    }

    public function test_execute_deletes_calendar_month_then_recreates_all_shifts(): void
    {
        $fakeCalendar   = new FakeGoogleCalendarService;
        $fakeRepository = new FakeShiftScheduleRepository;
        $useCase        = $this->makeUseCase($fakeCalendar, $fakeRepository);

        $fakeRepository->seed(1, ShiftEntries::fromArray([
            ['date' => '2024-07-01', 'type' => 'office'],
            ['date' => '2024-07-02', 'type' => 'remote'],
        ]));

        $command        = $this->makeCommand('2024-07');

        $result         = $useCase->execute($command);

        $this->assertSame(2, $result->successes->count());
        $this->assertSame(0, $result->failures->count());

        // 月単位のカレンダー削除が1回呼ばれること
        $this->assertCount(1, $fakeCalendar->deleteCalls);
        $deleteCall     = $fakeCalendar->deleteCalls[0];
        $this->assertSame('user@example.com', $deleteCall['authEmail']);
        $this->assertSame('2024-07-01', $deleteCall['start']->toDateString());
        $this->assertSame('2024-07-31', $deleteCall['end']->toDateString());

        // 2 shifts × (all-day + timed) = 4 件登録
        $this->assertCount(4, $fakeCalendar->blockCalls);

        // SYNCED に更新されること
        $this->assertCount(1, $fakeRepository->updateSyncStatusesCalls);
        $this->assertSame(ECalendarSyncStatus::SYNCED, $fakeRepository->updateSyncStatusesCalls[0]['status']);
        $this->assertSame(2, $fakeRepository->updateSyncStatusesCalls[0]['shifts']->count());
    }

    public function test_execute_marks_shift_as_failed_when_block_schedule_throws(): void
    {
        // 1 番目の blockSchedule 呼び出しで例外をスロー → 1件目の all-day が失敗
        $fakeCalendar   = new FakeGoogleCalendarService(throwOnBlockCallIndices: [0]);
        $fakeRepository = new FakeShiftScheduleRepository;
        $useCase        = $this->makeUseCase($fakeCalendar, $fakeRepository);

        $fakeRepository->seed(1, ShiftEntries::fromArray([
            ['date' => '2024-07-10', 'type' => 'office'],
        ]));

        $command        = $this->makeCommand('2024-07');

        $result         = $useCase->execute($command);

        $this->assertSame(0, $result->successes->count());
        $this->assertSame(1, $result->failures->count());

        // 月削除は実行されること（blockSchedule 失敗とは独立）
        $this->assertCount(1, $fakeCalendar->deleteCalls);

        // 失敗分が FAILED に更新されること
        $failedUpdates  = array_filter(
            $fakeRepository->updateSyncStatusesCalls,
            fn (array $call): bool => $call['status'] === ECalendarSyncStatus::FAILED,
        );
        $this->assertCount(1, $failedUpdates);
    }

    public function test_execute_handles_partial_failure(): void
    {
        // index: 0=allDay(office), 1=timed(office), 2=allDay(remote) で失敗
        $fakeCalendar   = new FakeGoogleCalendarService(throwOnBlockCallIndices: [2]);
        $fakeRepository = new FakeShiftScheduleRepository;
        $useCase        = $this->makeUseCase($fakeCalendar, $fakeRepository);

        $fakeRepository->seed(1, ShiftEntries::fromArray([
            ['date' => '2024-07-10', 'type' => 'office'],
            ['date' => '2024-07-11', 'type' => 'remote'],
        ]));

        $command        = $this->makeCommand('2024-07');

        $result         = $useCase->execute($command);

        $this->assertSame(1, $result->successes->count());
        $this->assertSame(1, $result->failures->count());

        $this->assertSame('2024-07-10', $result->successes->toArray()[0]['date']);
        $this->assertSame('2024-07-11', $result->failures->toArray()[0]['date']);

        // SYNCED と FAILED の両方が更新されること
        $statuses       = array_column($fakeRepository->updateSyncStatusesCalls, 'status');
        $this->assertContains(ECalendarSyncStatus::SYNCED, $statuses);
        $this->assertContains(ECalendarSyncStatus::FAILED, $statuses);
    }

    public function test_execute_only_processes_specified_month(): void
    {
        // 6月のシフトも storeに存在するが、指定月（7月）のみ処理されることを確認
        $fakeCalendar   = new FakeGoogleCalendarService;
        $fakeRepository = new FakeShiftScheduleRepository;
        $useCase        = $this->makeUseCase($fakeCalendar, $fakeRepository);

        // 7月のシフトのみセット（6月は未登録）
        $fakeRepository->seed(1, ShiftEntries::fromArray([
            ['date' => '2024-07-01', 'type' => 'office'],
        ]));

        $command        = $this->makeCommand('2024-07');

        $result         = $useCase->execute($command);

        $this->assertSame(1, $result->successes->count());

        // 指定月 (7月) の削除のみ実行されること
        $this->assertCount(1, $fakeCalendar->deleteCalls);
        $this->assertSame('2024-07-01', $fakeCalendar->deleteCalls[0]['start']->toDateString());
        $this->assertSame('2024-07-31', $fakeCalendar->deleteCalls[0]['end']->toDateString());
    }

    public function test_execute_event_details_for_holiday_type(): void
    {
        $fakeCalendar     = new FakeGoogleCalendarService;
        $fakeRepository   = new FakeShiftScheduleRepository;
        $fakeSettings     = new FakeShiftSettingsRepository;
        $useCase          = $this->makeUseCase($fakeCalendar, $fakeRepository, $fakeSettings);

        $fakeRepository->seed(1, ShiftEntries::fromArray([
            ['date' => '2024-07-15', 'type' => 'holiday'],
        ]));

        $command          = $this->makeCommand('2024-07');

        $useCase->execute($command);

        $this->assertCount(2, $fakeCalendar->blockCalls);

        [$allDay, $timed] = $fakeCalendar->blockCalls;

        $this->assertSame('休暇', $allDay['summary']);
        $this->assertSame('shift_sync', $allDay['source']);

        $this->assertSame('休暇', $timed['summary']);
        $this->assertSame('05:00', $timed['start']->format('H:i'));
        $this->assertSame('22:00', $timed['end']->format('H:i'));
    }

    public function test_execute_uses_user_shift_start_settings(): void
    {
        $fakeCalendar                    = new FakeGoogleCalendarService;
        $fakeRepository                  = new FakeShiftScheduleRepository;
        $fakeSettings                    = new FakeShiftSettingsRepository;
        $useCase                         = $this->makeUseCase($fakeCalendar, $fakeRepository, $fakeSettings);

        $fakeRepository->seed(1, ShiftEntries::fromArray([
            ['date' => '2024-07-01', 'type' => 'office'],
            ['date' => '2024-07-02', 'type' => 'remote'],
        ]));
        $fakeSettings->seed(1, new ShiftStartSettings('10:00', '11:00'));

        $useCase->execute($this->makeCommand('2024-07'));

        [, $officeTimed, , $remoteTimed] = $fakeCalendar->blockCalls;

        $this->assertSame([1], $fakeSettings->findOrDefaultCalls);
        $this->assertSame('10:00', $officeTimed['end']->format('H:i'));
        $this->assertSame('11:00', $remoteTimed['end']->format('H:i'));
    }

    public function test_execute_syncs_already_synced_shifts(): void
    {
        // SYNCED 済みのシフトも再同期対象になることを明示的に確認
        $fakeCalendar   = new FakeGoogleCalendarService;
        $fakeRepository = new FakeShiftScheduleRepository;
        $useCase        = $this->makeUseCase($fakeCalendar, $fakeRepository);

        $fakeRepository->seed(1, ShiftEntries::fromArray([
            ['date' => '2024-07-01', 'type' => 'office'],
        ]));

        $command        = $this->makeCommand('2024-07');

        $result         = $useCase->execute($command);

        // 成功すること
        $this->assertSame(1, $result->successes->count());

        // カレンダーの削除→再登録が行われること
        $this->assertCount(1, $fakeCalendar->deleteCalls);
        $this->assertCount(2, $fakeCalendar->blockCalls);

        // SYNCED に更新されること（二重更新だが冪等）
        $this->assertSame(ECalendarSyncStatus::SYNCED, $fakeRepository->updateSyncStatusesCalls[0]['status']);
    }
}
