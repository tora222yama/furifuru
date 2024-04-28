<?php

declare(strict_types=1);

namespace App\Services\Internal;

use App\Enum\App\EPipeKind;
use App\Enum\App\EStatusCode;
use App\GraphQL\PipeBase;

/**
 * 各Serviceを実行する際のpipe管理サービス.
 */
class PipeService
{
    protected array $pipes        = [];

    protected array $pipeArgs     = [];

    /**
     * エラートレース用.
     */
    protected array $paramArgs    = [];

    protected EPipeKind $pipeKind = EPipeKind::INVALID;

    /**
     * @return PipeBase[]
     */
    public function getPipes(string $class): array
    {
        return array_filter($this->pipes, function ($pipe) use ($class) {
            /** @var PipeBase $pipe */
            return ! $pipe->isCalled($class);
        });
    }

    /**
     * バリデーション実行結果を返す.
     */
    public function getValidationResult(): array
    {
        $status_code    = EStatusCode::UNPROCESSABLE_ENTITY->value;
        $status_message = 'validation error';

        // バリデーションエラーを格納.
        $errorValues    = [];
        /** @var PipeBase $pipe */
        foreach ($this->pipes as $pipe) {
            $validationErrors = $pipe->getValidationErrors();
            foreach ($validationErrors as $key => $validationError) {
                foreach ($validationError as $message) {
                    $errorValues[$key][] = $message;
                }
            }
        }

        $errors         = json_encode($errorValues);

        return compact('status_code', 'errors', 'status_message');
    }

    /**
     * バリデーションエラーがあるかどうか.
     */
    public function isValid(): bool
    {
        foreach ($this->pipes as $pipe) {
            /** @var PipeBase $pipe */
            if (! $pipe->isValid()) {
                return false;
            }
        }

        return true;
    }

    /**
     * 新しいパイプの追加.
     */
    public function insertNewPipe(PipeBase $pipe): PipeBase
    {
        $this->pipes[] = $pipe;
        $pipe->validate();

        return $pipe;
    }

    /**
     * フロントから渡されたパラメータを取得する.
     */
    public function getParamArgs(): array
    {
        return $this->paramArgs;
    }

    /**
     * フロントから渡されたパラメータを取得する.
     */
    public function getPipeArgs(): array
    {
        return [$this->pipeKind, $this->pipeArgs];
    }

    /**
     * フロントから渡されたパラメータをエラートレース用に保持しておく.
     */
    public function storeParam(array $args): void
    {
        $this->paramArgs = $args;
    }

    /**
     * フロントから渡されたパラメータをエラートレース用に保持しておく.
     */
    public function storePipe(EPipeKind $kind, array $args): void
    {
        $this->pipeKind = $kind;
        $this->pipeArgs = $args;
    }
}
