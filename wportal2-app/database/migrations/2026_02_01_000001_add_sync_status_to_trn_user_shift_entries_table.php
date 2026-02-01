<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('trn_user_shift_entries', function (Blueprint $table): void {
            $table->string('sync_status', 32)->default('pending');
            $table->timestamp('last_synced_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('trn_user_shift_entries', function (Blueprint $table): void {
            $table->dropColumn(['sync_status', 'last_synced_at']);
        });
    }
};
