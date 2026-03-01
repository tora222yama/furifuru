<?php

declare(strict_types=1);

namespace Tests\Fakes\External;

use App\Services\External\GoogleCalendarServiceInterface;
use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Google\Service\Calendar\Event;
use Illuminate\Support\Collection;
use RuntimeException;
use Throwable;

final class FakeGoogleCalendarService implements GoogleCalendarServiceInterface
{
    /** @var array<int, array{authEmail:string,start:CarbonImmutable,end:CarbonImmutable}> */
    public array $listScheduleCalls = [];

    /** @var array<int, array{authEmail:string,start:CarbonImmutable,end:CarbonImmutable,filter:callable|null}> */
    public array $deleteCalls       = [];

    /** @var array<int, array{authEmail:string,start:Carbon,end:Carbon,summary:string,location:string,description:string,descriptionPrefix:?string}> */
    public array $blockCalls        = [];

    /** @var list<int> */
    private array $throwOnBlockCallIndices;

    /** @var Collection<int, Event> */
    private Collection $listScheduleResult;

    private ?Throwable $throwOnListSchedule;

    /**
     * @param  list<int>  $throwOnBlockCallIndices  ブロック呼び出しで例外をスローするインデックスのリスト
     */
    public function __construct(array $throwOnBlockCallIndices = [])
    {
        $this->throwOnBlockCallIndices = $throwOnBlockCallIndices;
        $this->listScheduleResult      = collect();
        $this->throwOnListSchedule     = null;
    }

    /**
     * @param  Collection<int, Event>  $events
     */
    public function setListScheduleResult(Collection $events): void
    {
        $this->listScheduleResult = $events;
    }

    /**
     * @param  list<Event>  $events
     */
    public function seedListScheduleEvents(array $events): void
    {
        $this->listScheduleResult = collect($events);
    }

    public function throwOnListSchedule(?Throwable $throwable): void
    {
        $this->throwOnListSchedule = $throwable;
    }

    public function deleteSchedules(string $calendarId, CarbonImmutable $startDate, CarbonImmutable $endDate, ?callable $filter = null): void
    {
        $this->deleteCalls[] = [
            'authEmail' => $calendarId,
            'start'     => $startDate,
            'end'       => $endDate,
            'filter'    => $filter,
        ];
    }

    /**
     * @param  Collection<int, string>  $calendarIdList
     *
     * @throws RuntimeException
     */
    public function blockSchedule(
        string $authEmail,
        Collection $calendarIdList,
        Carbon $start,
        Carbon $end,
        string $summary,
        string $location,
        string $description,
        ?string $descriptionPrefix = null,
    ): void {
        $index              = count($this->blockCalls);
        $this->blockCalls[] = [
            'authEmail'         => $authEmail,
            'start'             => $start,
            'end'               => $end,
            'summary'           => $summary,
            'location'          => $location,
            'description'       => $description,
            'descriptionPrefix' => $descriptionPrefix,
        ];

        if (in_array($index, $this->throwOnBlockCallIndices, true)) {
            throw new RuntimeException('block failed');
        }
    }

    /**
     * @return Collection<int, Event>
     */
    public function listSchedule(string $calendarId, CarbonImmutable $startDate, CarbonImmutable $endDate): Collection
    {
        $this->listScheduleCalls[] = [
            'authEmail' => $calendarId,
            'start'     => $startDate,
            'end'       => $endDate,
        ];

        if ($this->throwOnListSchedule !== null) {
            throw $this->throwOnListSchedule;
        }

        return $this->listScheduleResult;
    }
}
