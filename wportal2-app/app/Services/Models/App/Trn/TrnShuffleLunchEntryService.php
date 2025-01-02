<?php

declare(strict_types=1);

namespace App\Services\Models\App\Trn;

use App\Enum\App\EPipeKind;
use App\Facades\Internal\PipeService;
use App\Models\App\Trn\TrnShuffleLunchEntry;
use App\Pipe\App\PipeAppShuffleLunchRegister;
use App\Pipe\PipeBase;
use App\Services\Models\ModelServiceBase;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Collection;
use Throwable;

class TrnShuffleLunchEntryService extends ModelServiceBase
{
    /**
     * パイプによる更新.
     *
     * @throws Throwable
     */
    public function updateByPipe(): void
    {
        foreach (PipeService::getPipes(__CLASS__) as $pipe) {
            $kind = $pipe->getKind();
            match ($kind) {
                EPipeKind::APP_SHUFFLE_LUNCH_REGISTER => $this->execAppShuffleLunchRegister($pipe),
                default                               => throw new Exception,
            };
            $pipe->onUpdate(__CLASS__);
        }
    }

    /**
     * @throws Throwable
     */
    private function execAppShuffleLunchRegister(
        PipeBase $pipe
    ): void {
        /** @var PipeAppShuffleLunchRegister $pipe */
        $new                  = new TrnShuffleLunchEntry;
        $new->trn_user_id     = $pipe->authUser?->TrnUser?->id ?: 0;
        $new->event_date      = Carbon::now();
        $new->event_time_zone = $pipe->eventTimeZone;

        $this->insertOrFail($new);
    }

    /**
     * 本日の参加者を取得する.
     *
     * @return Collection<int, TrnShuffleLunchEntry>
     */
    public function listToday(): Collection
    {
        /** @var Collection<int, TrnShuffleLunchEntry> */
        return TrnShuffleLunchEntry::query()
            ->whereDate('event_date', Carbon::now())
            ->alive()
            ->get();
    }
}
