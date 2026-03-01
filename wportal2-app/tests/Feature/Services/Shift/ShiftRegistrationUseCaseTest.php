<?php

declare(strict_types=1);

namespace Tests\Feature\Services\Shift;

use App\Dto\Shift\ShiftRegistrationCommand;
use App\Enum\App\ECalendarSyncStatus;
use App\Services\Shift\ShiftRegistrationUseCase;
use InvalidArgumentException;
use Tests\Fakes\External\FakeGoogleCalendarService;
use Tests\Fakes\Shift\FakeShiftScheduleRepository;
use Tests\TestCase;

final class ShiftRegistrationUseCaseTest extends TestCase
{
    private function makeUseCase(
        ?FakeGoogleCalendarService $calendarService = null,
        ?FakeShiftScheduleRepository $repository = null,
    ): ShiftRegistrationUseCase {
        return new ShiftRegistrationUseCase(
            $calendarService ?? new FakeGoogleCalendarService,
            $repository      ?? new FakeShiftScheduleRepository,
        );
    }

    public function test_execute_returns_empty_result_when_no_shifts(): void
    {
        $fakeCalendar    = new FakeGoogleCalendarService;
        $fakeRepository  = new FakeShiftScheduleRepository;
        $useCase         = $this->makeUseCase($fakeCalendar, $fakeRepository);

        $command         = new ShiftRegistrationCommand(trnUserId: 1, authEmail: 'user@example.com', shifts: []);

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
        ]);

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

        $this->assertSame('終日 出社', $allDayOffice['summary']);
        $this->assertSame('Office', $allDayOffice['location']);
        $this->assertSame('[SHIFT_SYNC]', $allDayOffice['descriptionPrefix']);
        $this->assertSame('出社', $timedOffice['summary']);

        $this->assertSame('終日 在宅', $allDayRemote['summary']);
        $this->assertSame('Remote', $allDayRemote['location']);
        $this->assertSame('[SHIFT_SYNC]', $allDayRemote['descriptionPrefix']);
        $this->assertSame('在宅', $timedRemote['summary']);
    }

    public function test_execute_marks_shift_as_failure_when_blocking_fails(): void
    {
        $fakeCalendar    = new FakeGoogleCalendarService(throwOnBlockCallIndices: [1]);
        $fakeRepository  = new FakeShiftScheduleRepository;
        $useCase         = $this->makeUseCase($fakeCalendar, $fakeRepository);

        $command         = new ShiftRegistrationCommand(1, 'user@example.com', [
            ['date' => '2024-07-10', 'type' => 'office'],
        ]);

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

    public function test_execute_throws_when_shifts_spread_over_multiple_months(): void
    {
        $fakeCalendar    = new FakeGoogleCalendarService;
        $fakeRepository  = new FakeShiftScheduleRepository;
        $useCase         = $this->makeUseCase($fakeCalendar, $fakeRepository);

        $command         = new ShiftRegistrationCommand(1, 'user@example.com', [
            ['date' => '2024-07-31', 'type' => 'office'],
            ['date' => '2024-08-01', 'type' => 'remote'],
        ]);

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('All shifts must belong to the same month');

        $useCase->execute($command);
    }
}
