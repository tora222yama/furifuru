<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Services\Shift\Domain\ShiftStartSettings;
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
        $allowedTimes = ShiftStartSettings::ALLOWED;

        return [
            'shifts'            => ['required', 'array'],
            'shifts.*.date'     => ['required', 'string'],
            'shifts.*.type'     => ['required', 'string'],
            'officeStartTime'   => ['nullable', 'string', 'in:'.implode(',', $allowedTimes)],
            'remoteStartTime'   => ['nullable', 'string', 'in:'.implode(',', $allowedTimes)],
        ];
    }
}
