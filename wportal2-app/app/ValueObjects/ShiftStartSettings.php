<?php

declare(strict_types=1);

namespace App\ValueObjects;

use InvalidArgumentException;

/**
 * 在宅・出社それぞれの勤務開始時刻設定。
 * 09:00〜11:00 の 30分刻りの値のみ受け付ける。
 */
final readonly class ShiftStartSettings
{
    /** 選択可能な時刻一覧 */
    public const ALLOWED      = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00'];

    public const DEFAULT_TIME = '09:00';

    public function __construct(
        /** 出社の勤務開始時刻（例: "09:30"） */
        public string $officeStartTime,
        /** 在宅の勤務開始時刻（例: "10:00"） */
        public string $remoteStartTime,
    ) {
        if (! in_array($officeStartTime, self::ALLOWED, true)) {
            throw new InvalidArgumentException("Invalid officeStartTime: {$officeStartTime}");
        }

        if (! in_array($remoteStartTime, self::ALLOWED, true)) {
            throw new InvalidArgumentException("Invalid remoteStartTime: {$remoteStartTime}");
        }
    }

    public static function default(): self
    {
        return new self(self::DEFAULT_TIME, self::DEFAULT_TIME);
    }

    /**
     * @param  array{officeStartTime?:string,remoteStartTime?:string}  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            $data['officeStartTime'] ?? self::DEFAULT_TIME,
            $data['remoteStartTime'] ?? self::DEFAULT_TIME,
        );
    }

    /**
     * "HH:MM" 文字列から時と分を取り出して Carbon に適用できる整数ペアを返す。
     *
     * @return array{hour: int, minute: int}
     */
    public static function parseTime(string $time): array
    {
        [$hour, $minute] = explode(':', $time);

        return ['hour' => (int) $hour, 'minute' => (int) $minute];
    }

    /** @return array{officeStartTime:string,remoteStartTime:string} */
    public function toArray(): array
    {
        return [
            'officeStartTime' => $this->officeStartTime,
            'remoteStartTime' => $this->remoteStartTime,
        ];
    }
}
