<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ShiftStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'shifts'            => ['required', 'array'],
            'shifts.*.date'     => ['required', 'string'],
            'shifts.*.type'     => ['required', 'string'],
        ];
    }
}
