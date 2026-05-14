<?php

declare(strict_types=1);

namespace Tests\Unit\Services\Shift;

use App\Services\Shift\Domain\ShiftCalendarSyncer;
use App\Services\Shift\Domain\ShiftEntries;
use App\Services\Shift\Domain\ShiftType;
use PHPUnit\Framework\TestCase;
use Tests\Fakes\External\FakeGoogleCalendarService;

class ShiftCalendarSyncerEventTypeTest extends TestCase
{
    /** @return array<string, array{ShiftType, ?string}> */
    public static function eventTypeProvider(): array
    {
        return [
            'オフィス出社はeventType無し' => [ShiftType::Office, null],
            '在宅はother'                 => [ShiftType::Remote, 'other'],
            '休暇はrest'                  => [ShiftType::Holiday, 'rest'],
            '出張はbizTrip'               => [ShiftType::BusinessTrip, 'bizTrip'],
        ];
    }

    /**
     * @dataProvider eventTypeProvider
     */
    public function test_all_day_event_has_correct_event_type(ShiftType $type, ?string $expectedEventType): void
    {
        $fake       = new FakeGoogleCalendarService;
        $syncer     = new ShiftCalendarSyncer($fake);

        $entries    = ShiftEntries::fromArray([
            ['date' => '2024-07-01', 'type' => $type->value],
        ]);

        $syncer->replaceCalendarMonth(
            'user@example.com',
            ['start' => '2024-07-01', 'end' => '2024-07-31'],
            $entries,
        );

        // blockScheduleは各シフトにつき終日(allDay=true)と時刻指定(allDay=false)の2回呼ばれる
        // 最初の呼び出しが終日予定（allDay=true）
        $allDayCall = collect($fake->blockCalls)->firstWhere('allDay', true);
        $this->assertNotNull($allDayCall, '終日予定のblockSchedule呼び出しが存在すること');
        $this->assertSame($expectedEventType, $allDayCall['eventType']);
        $this->assertSame('shift_sync', $allDayCall['source'], '終日予定にsource=shift_syncが設定されること');

        // 時刻指定予定にも source / eventType が設定されていること
        $timedCall  = collect($fake->blockCalls)->firstWhere('allDay', false);
        $this->assertNotNull($timedCall, '時刻指定予定のblockSchedule呼び出しが存在すること');
        $this->assertSame('shift_sync', $timedCall['source'], '時刻指定予定にもsource=shift_syncが設定されること');
        $this->assertSame('outOfOffice', $timedCall['eventType'], '時刻指定予定はoutOfOffice（不在）で登録されること');
    }
}
