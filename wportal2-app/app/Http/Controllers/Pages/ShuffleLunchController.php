<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Enum\App\EPages;
use App\Enum\App\ShuffleLunch\ECalculate;
use App\Enum\App\ShuffleLunch\ERegister;
use App\Enum\App\ShuffleLunch\ETimeZone;
use App\Facades\Internal\PipeService;
use App\Facades\Models\App\Trn\TrnShuffleLunchEntryService;
use App\Http\Controllers\Controller;
use App\Models\App\Trn\TrnShuffleLunchEntry;
use App\Pipe\App\PipeAppShuffleLunchCancel;
use App\Pipe\App\PipeAppShuffleLunchRegister;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

class ShuffleLunchController extends Controller
{
    public function invoke(): Response
    {
        return $this->render('ShuffleLunch/Index', [

            // マッチング情報.
            'timezone'                 => fn () => ETimeZone::STANDBY,
            'calculate'                => fn () => ECalculate::INVALID,
            'registered'               => fn () => ERegister::INVALID,

            // 本日のエントリー.
            'trnShuffleLunchEntryList' => fn () => $this->getTodayEntryList(),
        ]);
    }

    /**
     * シャッフルランチへの参加表明.
     */
    public function register(Request $request): RedirectResponse
    {
        // TODO: 計算済み状態かどうかのチェックを追加する.

        // パイプ作成.
        PipeService::insertNewPipe(
            new PipeAppShuffleLunchRegister($request->toArray())
        );

        // バリデーションチェック.
        if (! PipeService::isValid()) {
            redirect()->action(EPages::SHUFFLE_LUNCH->getInvokePath());
        }

        // 更新処理.
        DB::transaction(static function (): void {
            // エントリ情報の更新.
            TrnShuffleLunchEntryService::updateByPipe();
        });

        return redirect()->action(EPages::SHUFFLE_LUNCH->getInvokePath());
    }

    /**
     * シャッフルランチのキャンセル.
     */
    public function cancel(Request $request): RedirectResponse
    {
        // TODO: 計算済み状態かどうかのチェックを追加する.

        // パイプ作成.
        PipeService::insertNewPipe(
            new PipeAppShuffleLunchCancel($request->toArray())
        );

        // バリデーションチェック.
        if (! PipeService::isValid()) {
            redirect()->action(EPages::SHUFFLE_LUNCH->getInvokePath());
        }

        // 更新処理.
        DB::transaction(static function (): void {
            // エントリ情報の更新.
            TrnShuffleLunchEntryService::updateByPipe();
        });

        return redirect()->action(EPages::SHUFFLE_LUNCH->getInvokePath());
    }

    /**
     * 今日のエントリーの取得
     *
     * @param  array<mixed>  $with
     * @return array<mixed>
     */
    private function getTodayEntryList(array $with = []): array
    {
        return TrnShuffleLunchEntryService::listToday()
            ->map(function (TrnShuffleLunchEntry $trnShuffleLunchEntry) use ($with) {
                return $trnShuffleLunchEntry->toPayload($with);
            })->toArray();
    }
}
