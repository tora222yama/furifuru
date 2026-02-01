<?php

declare(strict_types=1);

namespace Tests\Fakes\External;

use App\Services\External\GoogleCalendarServiceInterface;
use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use RuntimeException;

final class FakeGoogleCalendarService implements GoogleCalendarServiceInterface
{
    /** @var array<int, array{authEmail:string,start:CarbonImmutable,end:CarbonImmutable,filter:callable|null}> */
    public array $deleteCalls = [];

    /** @var array<int, array{authEmail:string,start:Carbon,end:Carbon,summary:string,location:string,description:string,descriptionPrefix:?string}> */
    public array $blockCalls  = [];

    /** @var list<int> */
    private array $throwOnBlockCallIndices;

    /**
     * @param  list<int>  $throwOnBlockCallIndices  ブロック呼び出しで例外をスローするインデックスのリスト
     */
    public function __construct(array $throwOnBlockCallIndices = [])
    {
        $this->throwOnBlockCallIndices = $throwOnBlockCallIndices;
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
     * @return Collection<int, never>
     */
    public function listSchedule(string $calendarId, CarbonImmutable $startDate, CarbonImmutable $endDate): Collection
    {
        return collect();
    }
}
