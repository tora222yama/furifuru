<?php

declare(strict_types=1);

namespace App\Console\Commands\Batch;

use App\Console\Commands\Batch\ShuffleLunchMatching\GroupPack;
use App\Enum\App\ShuffleLunch\ECalculate;
use App\Enum\App\ShuffleLunch\EEventTimeZone;
use App\Facades\Models\App\Trn\TrnShuffleLunchEntryService;
use App\Facades\Usecases\UsecasesShuffleLunchService;
use App\Models\App\Trn\TrnShuffleLunchEntry;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Psr\SimpleCache\InvalidArgumentException;

class ShuffleLunchMatching extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature   = 'batch:ShuffleLunchMatching';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'シャッフルランチのマッチングを実施';

    /**
     * New a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @throws InvalidArgumentException
     */
    public function handle(): int
    {
        // マッチング処理を実施.
        $eventTimeZoneList = EEventTimeZone::cases();
        foreach ($eventTimeZoneList as $eventTimeZone) {
            if ($eventTimeZone === EEventTimeZone::INVALID) {
                continue;
            }

            $this->matching($eventTimeZone);
        }

        // 計算済みを登録.
        Cache::set(
            UsecasesShuffleLunchService::getRedisKey(),
            ECalculate::ESTABLISHED->value,
            UsecasesShuffleLunchService::getRedisTTL()
        );

        return self::SUCCESS;
    }

    /**
     * 指定タイムゾーンのマッチング処理を実施.
     */
    private function matching(EEventTimeZone $eventTimeZone): void
    {
        // 対象となるユーザーの取得.
        /** @var Collection<int, TrnShuffleLunchEntry> $targetUserList */
        $targetUserList = TrnShuffleLunchEntryService::listTodayByEventTimeZone(
            $eventTimeZone
        );

        // グループパックを作成.
        $groupPack      = GroupPack::createGroupPackByTotal($targetUserList->count());

        // TODO: 作成したグループパックにメンバーを当てはめていく.
    }
}
