<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\App\Trn\TrnUser;
use App\Models\App\Trn\TrnUserShiftEntry;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TrnUserShiftEntry>
 */
class TrnUserShiftEntryFactory extends Factory
{
    protected $model = TrnUserShiftEntry::class;

    public function definition(): array
    {
        return [
            'user_id' => TrnUser::factory(),
            'date'    => $this->faker->date(),
            'type'    => $this->faker->randomElement(['office', 'remote', 'holiday']),
        ];
    }
}
