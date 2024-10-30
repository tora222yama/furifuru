<?php

declare(strict_types=1);

namespace App\Services\Internal;

use App\Models\App\Auth\AuthUser;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

/**
 * Class ActivityLogService
 */
final class ActivityLogService
{
    private ?Collection $readyLogList       = null;

    private ?Collection $transactionLogList = null;

    /**
     * Modelの変更を実施.
     */
    public function changeModel(
        ?AuthUser $authUser,
        string $className,
        string $functionName,
        string $line,
        Model $model,
        array $appendKeyValue
    ): void {
        $authId = $authUser ? $authUser->id : 0;
        $output = '[changeDB] ';
        $output .= "Auth:$authId ";
        $output .= "$className:$functionName:$line ";
        $output .= 'Id:'.$model->getKey().' ';

        // Modelのdirty確認.
        foreach ($model->getDirty() as $key => $value) {
            $value    = $this->filterString($value);
            $original = $this->filterString($model->getOriginal($key));

            $output .= "$key:$original => $value ";
        }

        // 追加項目.
        foreach ($appendKeyValue as $key => $value) {
            $value = $this->filterString($value);

            $output .= "$key:$value ";
        }

        // ログを保持.
        $this->storeLog($output);
    }

    /**
     * ログの出力.
     */
    public function outputLog(): void
    {
        if ($this->readyLogList === null) {
            return;
        }

        // ログを全て出力.
        $this->readyLogList->each(function (string $log) {
            Log::info($log);
        });
    }

    /**
     * 改行コードなど、ログに反映させたくないものをフィルタ.
     *
     * @return string
     */
    private function filterString(mixed $value): mixed
    {
        if (! is_string($value)) {
            return $value;
        }

        return (string) str_replace("\n", '\\n', $value);
    }

    /**
     * ログを出力準備に保持.
     */
    private function storeLog(string $log): void
    {
        // 準備ログが存在しなければ作成しておく.
        if ($this->readyLogList === null) {
            $this->readyLogList = collect();
        }

        // トランザクション中はトランザクションに格納するのみ.
        if ($this->transactionLogList !== null) {
            $this->transactionLogList->add($log);

            return;
        }

        $this->readyLogList->add($log);
    }
}
