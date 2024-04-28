<?php

declare(strict_types=1);

namespace Database\Factories\App\Trn;

use Illuminate\Database\Eloquent\Factories\Factory;

class TrnFacilityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name'    => fake()->company(),
            'explain' => preg_replace('/。/', "。\n", fake()->realText(50)),
        ];
    }
}
