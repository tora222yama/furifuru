<?php

declare(strict_types=1);

namespace Tests\Unit\ValueObjects;

use App\ValueObjects\ShiftDate;
use App\ValueObjects\ShiftEntry;
use App\ValueObjects\ShiftType;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;

class ShiftEntryTest extends TestCase
{
    public function test_from_array_builds_shift_entry(): void
    {
        $entry = ShiftEntry::fromArray(['date' => '2024-06-01', 'type' => 'office']);

        $this->assertInstanceOf(ShiftDate::class, $entry->date);
        $this->assertSame('2024-06-01', $entry->date->toDateString());
        $this->assertSame(ShiftType::Office, $entry->type);
    }

    public function test_from_array_requires_date_and_type(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('ShiftEntry requires date and type');

        ShiftEntry::fromArray(['date' => '2024-06-01']);
    }

    public function test_from_array_validates_date_format(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('ShiftDate must be a valid date string (Y-m-d)');

        ShiftEntry::fromArray(['date' => '2024-02-30', 'type' => 'office']);
    }

    public function test_to_array_exports_payload(): void
    {
        $entry = new ShiftEntry(new ShiftDate('2024-06-02'), ShiftType::Remote);

        $this->assertSame(
            ['date' => '2024-06-02', 'type' => 'remote'],
            $entry->toArray()
        );
    }
}
