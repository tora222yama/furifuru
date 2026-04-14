<?php

declare(strict_types=1);

use App\Enum\App\ECalendarSyncStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    const TABLE_NAME = 'trn_shift_schedule';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create(self::TABLE_NAME, function (Blueprint $table) {
            $table->id();
            $table->integer('trn_user_id');
            $table->date('shift_date');
            $table->string('shift_type', 32);
            $table->integer('e_calendar_sync_status')->default(ECalendarSyncStatus::PENDING->value);
            $table->timestamps();

            $table->unique(['trn_user_id', 'shift_date']);
            $table->index('trn_user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(self::TABLE_NAME);
    }
};
