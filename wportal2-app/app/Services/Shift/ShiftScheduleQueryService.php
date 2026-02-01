<?php

declare(strict_types=1);

namespace App\Services\Shift;

use App\Collections\ShiftEntries;
use App\Constant\ShiftScheduleConstant;
use App\Services\External\GoogleCalendarServiceInterface;
use App\ValueObjects\ShiftType;
use Carbon\CarbonImmutable;
use Google\Service\Calendar\Event;
use Illuminate\Support\Facades\Log;
use Throwable;

final readonly class ShiftScheduleQueryService implements ShiftScheduleQueryServiceInterface
{
    public function __construct(private GoogleCalendarServiceInterface $googleCalendarService) {}

    public function getMonthlyShifts(string $authEmail, CarbonImmutable $targetMonth): ShiftEntries
    {
        $start       = $targetMonth->startOfMonth();
        $end         = $targetMonth->endOfMonth();

        try {
            $events = $this->googleCalendarService->listSchedule($authEmail, $start, $end);
        } catch (Throwable $e) {
            Log::warning('google calendar list failed: '.$e->getMessage());

            return ShiftEntries::fromArray([]);
        }

        $shiftByDate = [];

        foreach ($events as $event) {
            if (! $this->isShiftEvent($event)) {
                continue;
            }

            $date               = $this->extractDate($event);

            $type               = $this->detectShiftType($event);
            if ($type === null) {
                continue;
            }

            // 1日ごとに複数登録されているので、最初の1件だけを登録する
            if (isset($shiftByDate[$date])) {
                continue;
            }

            $shiftByDate[$date] = [
                'date' => $date,
                'type' => $type,
            ];
        }

        ksort($shiftByDate);

        $shifts      = array_values($shiftByDate);

        return ShiftEntries::fromArray($shifts);
    }

    private function isShiftEvent(Event $event): bool
    {
        $description = $event->getDescription();

        // @phpstan-ignore-next-line シグネチャ上はnullが入ってこないが、実際にはnullが入ってくる場合があるため
        if ($description === null) {
            $description = '';
        }

        return $description !== '' && str_contains($description, ShiftScheduleConstant::MARKER);
    }

    private function extractDate(Event $event): string
    {
        $start    = $event->getStart();

        $date     = $start->getDate();
        if (CarbonImmutable::canBeCreatedFromFormat($date, 'Y-m-d')) {
            return CarbonImmutable::parse($date)->toDateString();
        }

        $dateTime = $start->getDateTime();

        return CarbonImmutable::parse($dateTime)->toDateString();
    }

    private function detectShiftType(Event $event): ?string
    {
        $summary = $event->getSummary();

        return match (true) {
            str_contains($summary, '出社')   => ShiftType::Office->value,
            str_contains($summary, '在宅')   => ShiftType::Remote->value,
            str_contains($summary, '休暇')   => ShiftType::Holiday->value,
            default                          => null,
        };
    }
}
