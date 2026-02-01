<?php

declare(strict_types=1);

namespace Tests\Feature\Services\Shift;

use App\Dto\Shift\ShiftRegistrationCommand;
use App\Services\Shift\ShiftRegistrationUseCase;
use InvalidArgumentException;
use Tests\Fakes\External\FakeGoogleCalendarService;
use Tests\TestCase;

final class ShiftRegistrationUseCaseTest extends TestCase
{
    public function test_execute_returns_empty_result_when_no_shifts(): void
    {
        $fakeService = new FakeGoogleCalendarService;
        $useCase     = new ShiftRegistrationUseCase($fakeService);

        $command     = new ShiftRegistrationCommand(trnUserId: 1, authEmail: 'user@example.com', shifts: []);

        $result      = $useCase->execute($command);

        $this->assertSame(0, $result->successes->count());
        $this->assertSame(0, $result->failures->count());
        $this->assertSame([], $fakeService->deleteCalls);
        $this->assertSame([], $fakeService->blockCalls);
    }

    public function test_execute_deletes_month_and_syncs_all_shifts(): void
    {
        $fakeService                                               = new FakeGoogleCalendarService;
        $useCase                                                   = new ShiftRegistrationUseCase($fakeService);

        $command                                                   = new ShiftRegistrationCommand(1, 'user@example.com', [
            ['date' => '2024-07-01', 'type' => 'office'],
            ['date' => '2024-07-02', 'type' => 'remote'],
        ]);

        $result                                                    = $useCase->execute($command);

        $this->assertSame(2, $result->successes->count());
        $this->assertSame(0, $result->failures->count());

        $this->assertCount(1, $fakeService->deleteCalls);
        $deleteCall                                                = $fakeService->deleteCalls[0];
        $this->assertSame('user@example.com', $deleteCall['authEmail']);
        $this->assertSame('2024-07-01', $deleteCall['start']->toDateString());
        $this->assertSame('2024-07-31', $deleteCall['end']->toDateString());

        $this->assertCount(4, $fakeService->blockCalls); // 2 shifts x (all-day + timed)

        [$allDayOffice, $timedOffice, $allDayRemote, $timedRemote] = $fakeService->blockCalls;

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
        $fakeService = new FakeGoogleCalendarService(throwOnBlockCallIndices: [1]);
        $useCase     = new ShiftRegistrationUseCase($fakeService);

        $command     = new ShiftRegistrationCommand(1, 'user@example.com', [
            ['date' => '2024-07-10', 'type' => 'office'],
        ]);

        $result      = $useCase->execute($command);

        $this->assertSame(0, $result->successes->count());
        $this->assertSame(1, $result->failures->count());
        $this->assertCount(1, $fakeService->deleteCalls);
        $this->assertCount(2, $fakeService->blockCalls);
    }

    public function test_execute_throws_when_shifts_spread_over_multiple_months(): void
    {
        $fakeService = new FakeGoogleCalendarService;
        $useCase     = new ShiftRegistrationUseCase($fakeService);

        $command     = new ShiftRegistrationCommand(1, 'user@example.com', [
            ['date' => '2024-07-31', 'type' => 'office'],
            ['date' => '2024-08-01', 'type' => 'remote'],
        ]);

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('All shifts must belong to the same month');

        $useCase->execute($command);

        $this->assertSame([], $fakeService->deleteCalls);
        $this->assertSame([], $fakeService->blockCalls);
    }
}
