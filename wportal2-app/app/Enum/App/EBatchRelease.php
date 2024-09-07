<?php

declare(strict_types=1);

namespace App\Enum\App;

use Database\Seeders\Batch\Mst\Init\MstInitReward;

/**
 * バッチ種別
 */
enum EBatchRelease: string
{
    // 以下に更新用途に応じて追加する
    case MST_INIT_REWARD = 'mst_init_reward';

    /**
     * seederクラス.
     */
    public function class(): string
    {
        return match ($this) {
            self::MST_INIT_REWARD => MstInitReward::class,
        };
    }

    /**
     * 実行回数制限を持つかどうか.
     */
    public function hasLimit(): bool
    {
        return self::executionLimit() !== 0;
    }

    /**
     * 実行回数上限.
     *
     * @note 制限を設けない場合は0を指定する.
     */
    public function executionLimit(): int
    {
        return match ($this) {
            self::MST_INIT_REWARD => 0,
        };
    }
}
