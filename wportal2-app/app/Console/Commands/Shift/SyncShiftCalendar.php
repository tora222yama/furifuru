<?php

declare(strict_types=1);

namespace App\Console\Commands\Shift;

use App\Dto\Shift\SyncShiftCalendarCommand;
use App\Models\App\Auth\AuthUser;
use App\Services\Shift\SyncShiftCalendarUseCase;
use Carbon\CarbonImmutable;
use Illuminate\Console\Command;

class SyncShiftCalendar extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature   = 'shift:sync-calendar
                            {email : 対象ユーザーのメールアドレス}
                            {month? : 対象月（yyyy-MM 形式。省略時は当月）}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '指定月のシフトを Google Calendar に完全上書き同期する（DB を SoT として削除→再作成）。cron や手動実行で利用する。';

    public function __construct(private readonly SyncShiftCalendarUseCase $syncShiftCalendarUseCase)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $email       = (string) $this->argument('email');
        $monthArg    = (string) ($this->argument('month') ?? now()->format('Y-m'));
        $targetMonth = CarbonImmutable::createFromFormat('Y-m', $monthArg)?->startOfMonth();

        if ($targetMonth === null) {
            $this->error("月の形式が不正です: {$monthArg} （例: 2024-07）");

            return self::FAILURE;
        }

        /** @var AuthUser|null $authUser */
        $authUser    = AuthUser::where('email', $email)->first();

        if ($authUser === null) {
            $this->error("指定されたメールアドレスのユーザーが見つかりません: {$email}");

            return self::FAILURE;
        }

        $trnUser     = $authUser->TrnUser;

        if ($trnUser === null) {
            $this->error("TrnUser が見つかりません (email: {$email})");

            return self::FAILURE;
        }

        $this->info("対象ユーザー : {$email} (trn_user_id: {$trnUser->id}) 対象月: {$targetMonth->format('Y-m')}");

        $command     = new SyncShiftCalendarCommand(
            trnUserId: $trnUser->id,
            authEmail: $email,
            targetMonth: $targetMonth,
        );

        $result      = $this->syncShiftCalendarUseCase->execute($command);

        $this->newLine();

        if ($result->successes->isEmpty() && $result->failures->isEmpty()) {
            $this->line("対象月のシフトが登録されていません ({$targetMonth->format('Y-m')})。");

            return self::SUCCESS;
        }

        if (! $result->successes->isEmpty()) {
            $this->info('✅ Google Calendar 再同期 成功:');
            $this->table(
                ['日付', 'シフト種別'],
                array_map(fn (array $s): array => [$s['date'], $s['type']], $result->successes->toArray()),
            );
        }

        if (! $result->failures->isEmpty()) {
            $this->warn('⚠️  Google Calendar 再同期 失敗:');
            $this->table(
                ['日付', 'シフト種別'],
                array_map(fn (array $s): array => [$s['date'], $s['type']], $result->failures->toArray()),
            );
        }

        $this->newLine();
        $this->info(sprintf(
            '完了: 成功 %d 件 / 失敗 %d 件',
            $result->successes->count(),
            $result->failures->count(),
        ));

        return $result->failures->isEmpty() ? self::SUCCESS : self::FAILURE;
    }
}
