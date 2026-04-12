<?php

declare(strict_types=1);

namespace App\Services\Shift\Domain;

use App\Exceptions\ShiftEntryValidationException;
use ArrayIterator;
use Countable;
use InvalidArgumentException;
use IteratorAggregate;
use Throwable;
use Traversable;

/**
 * @implements IteratorAggregate<int, ShiftEntry>
 */
final class ShiftEntries implements Countable, IteratorAggregate
{
    /** @var list<ShiftEntry> */
    private array $items;

    /**
     * @param  iterable<ShiftEntry>  $items
     */
    private function __construct(iterable $items = [])
    {
        $this->items = [];
        foreach ($items as $item) {
            $this->items[] = $this->castItem($item);
        }
    }

    public static function empty(): self
    {
        return new self([]);
    }

    /**
     * @param  array<int, array{date:string,type:string}>  $shifts
     */
    public static function fromArray(array $shifts): self
    {
        $items  = [];
        $errors = [];

        foreach ($shifts as $index => $shift) {
            try {
                $items[] = self::castItemStatic($shift);
            } catch (Throwable $e) {
                $errors[] = [
                    'index'   => $index,
                    'payload' => $shift,
                    'message' => $e->getMessage(),
                ];
            }
        }

        if ($errors !== []) {
            throw new ShiftEntryValidationException($errors);
        }

        return new self($items);
    }

    public function getIterator(): Traversable
    {
        return new ArrayIterator($this->items);
    }

    public function count(): int
    {
        return count($this->items);
    }

    public function isEmpty(): bool
    {
        return $this->items === [];
    }

    public function push(ShiftEntry $entry): self
    {
        $this->items[] = $entry;

        return $this;
    }

    public function values(): self
    {
        return new self($this->items);
    }

    /** @return list<ShiftEntry> */
    public function toList(): array
    {
        return $this->items;
    }

    /** @return list<array{date:string,type:string}> */
    public function toArray(): array
    {
        return array_map(static fn (ShiftEntry $entry): array => $entry->toArray(), $this->items);
    }

    /** @param ShiftEntry|array{date:string,type:string} $item */
    private function castItem(ShiftEntry|array $item): ShiftEntry
    {
        if ($item instanceof ShiftEntry) {
            return $item;
        }

        return ShiftEntry::fromArray($item);
    }

    /** @param ShiftEntry|array{date:string,type:string} $item */
    private static function castItemStatic(ShiftEntry|array $item): ShiftEntry
    {
        if ($item instanceof ShiftEntry) {
            return $item;
        }

        return ShiftEntry::fromArray($item);
    }

    public function first(): ?ShiftEntry
    {
        return $this->items[0] ?? null;
    }

    /** @return array{start: string, end: string} */
    public function monthRangeOrFail(): array
    {
        $first      = $this->first();
        if ($first === null) {
            throw new InvalidArgumentException('Shifts cannot be empty when determining month range');
        }

        $firstMonth = $first->date->toCarbonImmutable()->format('Y-m');

        foreach ($this->items as $item) {
            if ($item->date->toCarbonImmutable()->format('Y-m') !== $firstMonth) {
                throw new InvalidArgumentException('All shifts must belong to the same month');
            }
        }

        $start      = $first->date->toCarbonImmutable()->startOfMonth()->toDateString();
        $end        = $first->date->toCarbonImmutable()->endOfMonth()->toDateString();

        return ['start' => $start, 'end' => $end];
    }
}
