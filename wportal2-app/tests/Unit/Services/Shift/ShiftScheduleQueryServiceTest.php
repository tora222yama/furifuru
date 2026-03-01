<?php

declare(strict_types=1);

namespace Tests\Unit\Services\Shift;

use App\Collections\ShiftEntries;
use App\Services\Shift\ShiftScheduleQueryService;
use Carbon\CarbonImmutable;
use Tests\Fakes\Shift\FakeShiftScheduleRepository;
use Tests\TestCase;

final class ShiftScheduleQueryServiceTest extends TestCase
{
    public function test_get_monthly_shifts_delegates_to_repository(): void
    {
        $fakeRepository = new FakeShiftScheduleRepository;
        $service        = new ShiftScheduleQueryService($fakeRepository);

        $fakeRepository->seed(42, ShiftEntries::fromArray([
            ['date' => '2024-07-01', 'type' => 'office'],
            ['date' => '2024-07-02', 'type' => 'remote'],
        ]));

        $result         = $service->getMonthlyShifts(42, CarbonImmutable::parse('2024-07-15'));

        $this->assertSame([
            ['date' => '2024-07-01', 'type' => 'office'],
            ['date' => '2024-07-02', 'type' => 'remote'],
        ], $result->toArray());

        $this->assertCount(1, $fakeRepository->getMonthlyShiftsCalls);
        $this->assertSame(42, $fakeRepository->getMonthlyShiftsCalls[0]['trnUserId']);
        $this->assertSame('2024-07', $fakeRepository->getMonthlyShiftsCalls[0]['targetMonth']->format('Y-m'));
    }

    public function test_get_monthly_shifts_returns_empty_when_repository_has_no_data(): void
    {
        $fakeRepository = new FakeShiftScheduleRepository;
        $service        = new ShiftScheduleQueryService($fakeRepository);

        $result         = $service->getMonthlyShifts(99, CarbonImmutable::parse('2024-07-15'));

        $this->assertSame([], $result->toArray());
    }
}
