<?php

declare(strict_types=1);

namespace App\Services\Models;

use Exception;

class ModelServiceBase
{
    /**
     * 新規登録（orFail）
     *
     * @throws Exception
     */
    public function insertOrFail(object $model): void
    {
        if (! empty($model->id)) {
            throw new Exception('invalid primary key.');
        }
        $model->saveOrFail();
    }

    /**
     * 更新処理（orFail)
     *
     * @throws Exception
     */
    public function updateOrFail(object $model): void
    {
        if (empty($model->id)) {
            throw new Exception('invalid primary key.');
        }
        $model->saveOrFail();
    }

    /**
     * 削除処理（orFail）
     *
     * @throws Exception
     */
    public function deleteOrFail(object $model): void
    {
        if (empty($model->id)) {
            throw new Exception('invalid primary key.');
        }
        $model->deleteOrFail();
    }
}
