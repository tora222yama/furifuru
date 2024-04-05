<?php

declare(strict_types=1);

namespace App\Logging;

use Exception;
use InvalidArgumentException;
use Monolog\Formatter\JsonFormatter;
use Throwable;

use function get_class;
use function gettype;

/**
 * 文字列とオブジェクトが混在するJsonFormatterのtrace出力を、
 * 文字列だけにするためだけのFormatter
 */
class JsonCustomizeFormatter extends JsonFormatter
{
    /**
     * JsonFormatter->normalizeExceptionをoverride
     *
     * @param  Exception|Throwable  $e
     */
    protected function normalizeException(Throwable $e, int $depth = 0): array
    {
        // NOTE: 2.0 only check for Throwable
        if (! $e instanceof Exception && ! $e instanceof Throwable) {
            throw new InvalidArgumentException('Exception/Throwable expected, got '.gettype($e).' / '.get_class($e));
        }

        $data = [
            'class'   => get_class($e),
            'message' => $e->getMessage(),
            'code'    => $e->getCode(),
            'file'    => $e->getFile().':'.$e->getLine(),
        ];

        if ($this->includeStacktraces) {
            // traceを文字列で取得し、改行で区切った配列にする
            $trace         = $e->getTraceAsString();
            $data['trace'] = explode("\n", $trace);
        }

        if ($previous = $e->getPrevious()) {
            $data['previous'] = $this->normalizeException($previous);
        }

        return $data;
    }
}
