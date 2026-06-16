<?php

declare(strict_types=1);

namespace App\Services\Shift\Domain;

use App\Constant\ShiftScheduleConstant;
use App\Services\External\GoogleCalendarServiceInterface;
use App\Services\Shift\UseCase\ShiftSyncResult;
use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Google\Service\Calendar\Event;
use Google\Service\Calendar\EventExtendedProperties;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use Throwable;

/**
 * Google Calendar へのシフト同期処理をまとめたサービス。
 *
 * ShiftRegistrationUseCase / SyncShiftCalendarUseCase から共通利用される。
 */
final readonly class ShiftCalendarSyncer
{
    public function __construct(
        private GoogleCalendarServiceInterface $googleCalendarService,
    ) {}

    /**
     * 指定月の Google Calendar を一括削除し、渡したシフトで再作成する.
     *
     * 「削除 → 再作成」は常にセットで行われるため、呼び出し側が2ステップを
     * 意識しなくて済むよう1メソッドにまとめている。
     *
     * @param  array{start:string,end:string}  $monthRange
     */
    public function replaceCalendarMonth(
        string $authEmail,
        array $monthRange,
        ShiftEntries $shifts,
        ?ShiftStartSettings $startSettings = null,
    ): ShiftSyncResult {
        $this->deleteGoogleCalendarMonth($authEmail, $monthRange);

        return $this->syncShifts($authEmail, $shifts, $startSettings ?? ShiftStartSettings::default());
    }

    /**
     * 渡されたシフトの日付だけ Google Calendar を削除し、再作成する.
     */
    public function replaceCalendarDates(
        string $authEmail,
        ShiftEntries $shifts,
        ?ShiftStartSettings $startSettings = null,
    ): ShiftSyncResult {
        $deletedDates = [];

        foreach ($shifts as $shift) {
            $dateKey                = $shift->date->toDateString();
            if (isset($deletedDates[$dateKey])) {
                continue;
            }

            $this->deleteGoogleCalendarDay($authEmail, $shift->date->toCarbonImmutable());
            $deletedDates[$dateKey] = true;
        }

        return $this->syncShifts($authEmail, $shifts, $startSettings ?? ShiftStartSettings::default());
    }

    /**
     * @param  array{start:string,end:string}  $monthRange
     *
     * @throws InvalidArgumentException
     */
    private function deleteGoogleCalendarMonth(string $authEmail, array $monthRange): void
    {
        $start = CarbonImmutable::createFromFormat('Y-m-d', $monthRange['start']);
        $end   = CarbonImmutable::createFromFormat('Y-m-d', $monthRange['end']);

        if ($start === null || $end === null) {
            throw new InvalidArgumentException('Invalid month range date format');
        }

        $start = $start->startOfDay();
        $end   = $end->endOfDay();

        try {
            $this->googleCalendarService->deleteSchedules(
                $authEmail,
                $start,
                $end,
                fn (Event $event): bool => $this->isShiftEvent($event),
            );
        } catch (Throwable $e) {
            Log::warning('google calendar month delete failed: '.$e->getMessage());
        }
    }

    private function deleteGoogleCalendarDay(string $authEmail, CarbonImmutable $date): void
    {
        try {
            $this->googleCalendarService->deleteSchedules(
                $authEmail,
                $date->startOfDay(),
                $date->endOfDay(),
                fn (Event $event): bool => $this->isShiftEvent($event),
            );
        } catch (Throwable $e) {
            Log::warning('google calendar day delete failed: '.$e->getMessage());
        }
    }

    /**
     * シフト一覧を Google Calendar に登録し、成功・失敗を返す.
     */
    private function syncShifts(string $authEmail, ShiftEntries $shifts, ShiftStartSettings $startSettings): ShiftSyncResult
    {
        $calendarIdList = collect();
        $failed         = ShiftEntries::empty();
        $succeeded      = ShiftEntries::empty();

        foreach ($shifts as $shift) {
            $date     = $shift->date->toCarbon();
            $type     = $shift->type;

            $allDayOk = $this->createAllDayEvent($authEmail, $calendarIdList, $date, $type);
            $timedOk  = $this->createTimedEvent($authEmail, $calendarIdList, $date, $type, startSettings: $startSettings);

            if ($allDayOk && $timedOk) {
                $succeeded->push($shift);
            } else {
                $failed->push($shift);
            }
        }

        return new ShiftSyncResult($succeeded, $failed);
    }

    /** @param Collection<int, string> $calendarIdList */
    private function createAllDayEvent(string $authEmail, Collection $calendarIdList, Carbon $date, ShiftType $type, string $transparency = 'transparent'): bool
    {
        $start     = $date->copy()->startOfDay();
        $summary   = $this->summaryForType($type, true);

        // eventType判定
        $eventType = match ($type) {
            ShiftType::Remote       => 'other',
            ShiftType::Holiday      => 'rest',
            ShiftType::BusinessTrip => 'bizTrip',
            ShiftType::Office       => null, // オフィス出社は設定無し
        };

        try {
            $this->googleCalendarService->blockSchedule(
                $authEmail,
                $calendarIdList,
                $start,
                $start,
                $summary,
                transparency: $transparency,
                allDay: true,
                eventType: $eventType,
                source: ShiftScheduleConstant::SOURCE_EXTENDED_VALUE,
            );

            return true;
        } catch (Throwable $e) {
            Log::warning('google calendar all-day sync failed: '.$e->getMessage());

            return false;
        }
    }

    /** @param Collection<int, string> $calendarIdList */
    private function createTimedEvent(
        string $authEmail,
        Collection $calendarIdList,
        Carbon $date,
        ShiftType $type,
        string $transparency = 'opaque',
        ?ShiftStartSettings $startSettings = null,
    ): bool {
        $startSettings ??= ShiftStartSettings::default();
        if ($type === ShiftType::Holiday) {
            $start = $date->copy()->setTime(5, 0);
            $end   = $date->copy()->setTime(22, 0);
        } else {
            $endTimeStr = match ($type) {
                ShiftType::Office => $startSettings->officeStartTime,
                ShiftType::Remote => $startSettings->remoteStartTime,
                default           => ShiftStartSettings::DEFAULT_TIME,
            };
            $endTime    = ShiftStartSettings::parseTime($endTimeStr);
            $start      = $date->copy()->setTime(5, 0);
            $end        = $date->copy()->setTime($endTime['hour'], $endTime['minute']);
        }

        $summary   = $this->summaryForType($type, false);
        $eventType = $type === ShiftType::Holiday ? 'rest' : 'outOfOffice';

        try {
            $this->googleCalendarService->blockSchedule(
                $authEmail,
                $calendarIdList,
                $start,
                $end,
                $summary,
                transparency: $transparency,
                eventType: $eventType,
                source: ShiftScheduleConstant::SOURCE_EXTENDED_VALUE,
            );

            return true;
        } catch (Throwable $e) {
            Log::warning('google calendar timed sync failed: '.$e->getMessage());

            return false;
        }
    }

    private function isShiftEvent(Event $event): bool
    {
        // 新方式: extendedProperties.shared['source'] = 'shift_sync' で判定
        $extProps = $event->getExtendedProperties();
        // getExtendedProperties() は PHPDoc 上 non-nullable だが実際は null を返す場合があるため instanceof で確認
        // @phpstan-ignore instanceof.alwaysTrue
        $shared   = $extProps instanceof EventExtendedProperties ? $extProps->getShared() : [];

        if (($shared[ShiftScheduleConstant::SOURCE_EXTENDED_KEY] ?? null)
            === ShiftScheduleConstant::SOURCE_EXTENDED_VALUE
        ) {
            return true;
        }

        // 旧方式: description に '[SHIFT_SYNC]' マーカーを埋め込んでいた旧イベントも削除対象とする。
        // 全イベントが extendedProperties ベースに移行完了したら、以下の行は削除してよい。
        return str_contains((string) $event->getDescription(), ShiftScheduleConstant::MARKER);
    }

    private function summaryForType(ShiftType $type, bool $allDay): string
    {
        return match ($type) {
            ShiftType::Remote       => $allDay ? '在宅' : '出勤（在宅）',
            ShiftType::Office       => $allDay ? 'オフィス出社' : '出勤（オフィス）',
            ShiftType::BusinessTrip => $allDay ? '出張' : '出勤（出張）',
            ShiftType::Holiday      => '休暇',
        };
    }
}
