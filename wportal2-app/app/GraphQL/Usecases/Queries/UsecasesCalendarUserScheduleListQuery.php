<?php

declare(strict_types=1);

namespace App\GraphQL\Usecases\Queries;

use App\Facades\External\GoogleCalendarService;
use App\Facades\Internal\PipeService;
use App\Pipe\Usecases\PipeUsecasesCalendarUserScheduleListQuery;
use Google\Service\Calendar\Event;

final class UsecasesCalendarUserScheduleListQuery
{
    public function __invoke($_, array $args): array
    {
        // 早く完了しないように強制遅延.
        localSleep();

        // パイプ作成.
        /** @var PipeUsecasesCalendarUserScheduleListQuery $pipe */
        $pipe      = PipeService::insertNewPipe(
            new PipeUsecasesCalendarUserScheduleListQuery($args)
        );

        $ret       = [];

        $eventList = GoogleCalendarService::listSchedule(
            'miki-yoji@919.jp',
            $pipe->startDate,
            $pipe->endDate,
        );
        $eventList
            ->reject(function (Event $event) {
                return $event->transparency === 'transparent';
            })
            ->each(function (Event $event) use (&$ret) {
                $ret[] = [
                    'id'           => $event->id                      ?? '',
                    'calendarId'   => 'miki-yoji@919.jp',
                    'kind'         => $event->kind                    ?? '',
                    'summary'      => $event->summary                 ?? '',
                    'start'        => $event->getStart()->dateTime    ?? '',
                    'end'          => $event->getEnd()->dateTime      ?? '',
                    'transparency' => $event->transparency          ?? '',
                ];
            });

        $eventList = GoogleCalendarService::listSchedule(
            'tobaru-hideyasu@919.jp',
            $pipe->startDate,
            $pipe->endDate,
        );
        $eventList
            ->reject(function (Event $event) {
                return $event->transparency === 'transparent';
            })
            ->each(function (Event $event) use (&$ret) {
                $ret[] = [
                    'id'           => $event->id                      ?? '',
                    'calendarId'   => 'tobaru-hideyasu@919.jp',
                    'kind'         => $event->kind                    ?? '',
                    'summary'      => $event->summary                 ?? '',
                    'start'        => $event->getStart()->dateTime    ?? '',
                    'end'          => $event->getEnd()->dateTime      ?? '',
                    'transparency' => $event->transparency          ?? '',
                ];
            });

        return $ret;
    }
}
