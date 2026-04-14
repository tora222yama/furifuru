<?php

declare(strict_types=1);

namespace App\Services\Shift\UseCase;

use App\Models\App\Trn\TrnUser;
use App\Services\Shift\Domain\ShiftEntry;
use App\Services\Shift\Domain\ShiftScheduleRepositoryInterface;
use Carbon\CarbonImmutable;
use Carbon\CarbonPeriod;

final class ExportMonthlyShiftUseCase
{
    public function __construct(
        private readonly ShiftScheduleRepositoryInterface $shiftScheduleRepository,
    ) {}

    /**
     * 全ユーザーの指定月シフトをCSV行のイテレータとして返す。
     *
     * 行 = ユーザー（五十音順）、列 = 日付（1日〜末日）。
     *
     * @return \Generator<int, array<int, string>>
     */
    public function execute(ExportMonthlyShiftCommand $command): \Generator
    {
        $targetMonth = $command->targetMonth;
        $dates       = $this->buildDateRange($targetMonth);

        // ヘッダー行: 名前, メール, 2026-04-01, 2026-04-02, ...
        yield array_merge(['名前', 'メール'], array_map(
            fn (CarbonImmutable $d): string => $d->format('Y-m-d'),
            $dates,
        ));

        // 全アクティブユーザー（名前五十音順）
        /** @var \Illuminate\Support\Collection<int, TrnUser> $sorted */
        $sorted      = TrnUser::query()
            ->with('AuthUser')
            ->alive()
            ->get();
        $users       = $sorted
            ->sortBy(fn (TrnUser $u): string => $u->AuthUser->name ?? '')
            ->values();

        // 全ユーザーのシフトを一括取得
        $allShifts   = $this->shiftScheduleRepository->getAllUsersMonthlyShifts($targetMonth);

        /** @var TrnUser $user */
        foreach ($users as $user) {
            $userName  = $user->AuthUser->name   ?? '';
            $userEmail = $user->AuthUser->email  ?? '';
            $entries   = $allShifts[$user->id]   ?? null;

            // 日付 => ShiftEntry のマップを作成
            $dateMap   = [];
            if ($entries !== null) {
                /** @var ShiftEntry $entry */
                foreach ($entries as $entry) {
                    $dateMap[$entry->date->toDateString()] = $entry;
                }
            }

            $row       = [$userName, $userEmail];
            foreach ($dates as $date) {
                $key   = $date->format('Y-m-d');
                $entry = $dateMap[$key] ?? null;
                $row[] = $entry !== null ? $entry->type->toJapanese() : '';
            }

            yield $row;
        }
    }

    /**
     * @return CarbonImmutable[]
     */
    private function buildDateRange(CarbonImmutable $targetMonth): array
    {
        $start = $targetMonth->startOfMonth();
        $end   = $targetMonth->endOfMonth();

        $dates = [];
        foreach (CarbonPeriod::create($start, $end) as $date) {
            $dates[] = CarbonImmutable::parse($date);
        }

        return $dates;
    }
}
