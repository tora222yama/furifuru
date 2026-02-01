<?php

declare(strict_types=1);

namespace Tests\Unit\Collections;

use App\Collections\ShiftEntries;
use App\Exceptions\ShiftEntryValidationException;
use App\ValueObjects\ShiftDate;
use App\ValueObjects\ShiftEntry;
use App\ValueObjects\ShiftType;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;

class ShiftEntriesTest extends TestCase
{
    public function test_from_array_builds_collection(): void
    {
        $payload = [
            ['date' => '2024-07-01', 'type' => 'office'],
            ['date' => '2024-07-02', 'type' => 'remote'],
        ];

        $entries = ShiftEntries::fromArray($payload);

        $this->assertCount(2, $entries);
        $this->assertSame($payload, $entries->toArray());
        $this->assertFalse($entries->isEmpty());
    }

    public function test_from_array_aggregates_validation_errors(): void
    {
        $payload = [
            ['date' => '2024-07-01', 'type' => 'office'],
            ['date' => 'invalid-date', 'type' => 'office'],
            ['date' => '2024-07-03', 'type' => 'unknown'],
        ];

        try {
            ShiftEntries::fromArray($payload);
            $this->fail('Expected ShiftEntryValidationException to be thrown');
        } catch (ShiftEntryValidationException $e) {
            $errors = $e->errors();

            $this->assertCount(2, $errors);
            $this->assertSame(1, $errors[0]['index']);
            $this->assertSame($payload[1], $errors[0]['payload']);
            $this->assertSame(2, $errors[1]['index']);
            $this->assertSame($payload[2], $errors[1]['payload']);
        }
    }

    public function test_month_range_or_fail_returns_range_for_month(): void
    {
        $entries = ShiftEntries::fromArray([
            ['date' => '2024-07-10', 'type' => 'office'],
            ['date' => '2024-07-01', 'type' => 'remote'],
        ]);

        $range   = $entries->monthRangeOrFail();

        $this->assertSame('2024-07-01', $range['start']);
        $this->assertSame('2024-07-31', $range['end']);
    }

    public function test_month_range_or_fail_throws_on_empty_collection(): void
    {
        $entries = ShiftEntries::empty();

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Shifts cannot be empty when determining month range');

        $entries->monthRangeOrFail();
    }

    public function test_month_range_or_fail_throws_when_months_differ(): void
    {
        $entries = ShiftEntries::fromArray([
            ['date' => '2024-07-01', 'type' => 'office'],
            ['date' => '2024-08-01', 'type' => 'remote'],
        ]);

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('All shifts must belong to the same month');

        $entries->monthRangeOrFail();
    }

    public function test_push_adds_entry_and_returns_self(): void
    {
        $entries  = ShiftEntries::empty();
        $entry    = new ShiftEntry(new ShiftDate('2024-07-05'), ShiftType::Holiday);

        $returned = $entries->push($entry);

        $this->assertSame($entries, $returned);
        $this->assertCount(1, $entries);
        $this->assertSame($entry, $entries->first());
    }
}
