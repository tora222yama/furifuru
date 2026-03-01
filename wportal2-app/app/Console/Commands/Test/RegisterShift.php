<?php

declare(strict_types=1);

namespace App\Console\Commands\Test;

use App\Dto\Shift\ShiftRegistrationCommand;
use App\Models\App\Auth\AuthUser;
use App\Services\Shift\ShiftRegistrationUseCase;
use App\ValueObjects\ShiftType;
use Illuminate\Console\Command;
use InvalidArgumentException;

class RegisterShift extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature   = 'test:register-shift
                            {email : 対象ユーザーのメールアドレス}
                            {--shifts=* : シフト情報 (例: 2026-03-10:office 2026-03-11:remote)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'シフト登録 UseCase の動作確認用コマンド。指定したメールアドレスのユーザーに対してシフトを登録し、Google Calendar との同期結果を表示する。';

    public function __construct(private readonly ShiftRegistrationUseCase $shiftRegistrationUseCase)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $email        = (string) $this->argument('email');

        // ユーザー取得
        /** @var AuthUser|null $authUser */
        $authUser     = AuthUser::where('email', $email)->first();
        if ($authUser === null) {
            $this->error("指定されたメールアドレスのユーザーが見つかりません: {$email}");

            return self::FAILURE;
        }

        $trnUser      = $authUser->TrnUser;
        if ($trnUser === null) {
            $this->error("TrnUser が見つかりません (email: {$email})");

            return self::FAILURE;
        }

        // --shifts オプションのパース
        $shiftOptions = $this->option('shifts');

        if (empty($shiftOptions)) {
            $shiftOptions = $this->promptShiftsInteractively();
        }

        $shifts       = $this->parseShiftOptions(array_values(array_filter((array) $shiftOptions, fn ($v) => is_string($v))));
        if ($shifts === null) {
            return self::FAILURE;
        }

        // 確認表示
        $this->info("対象ユーザー : {$email} (trn_user_id: {$trnUser->id})");
        $this->table(
            ['日付', 'シフト種別'],
            array_map(fn (array $s): array => [$s['date'], $s['type']], $shifts),
        );

        if (! $this->confirm('上記のシフトを登録しますか？')) {
            $this->line('キャンセルしました。');

            return self::SUCCESS;
        }

        // UseCase 実行
        try {
            $command = ShiftRegistrationCommand::fromPayloads($trnUser->id, $email, $shifts);
            $result  = $this->shiftRegistrationUseCase->execute($command);
        } catch (InvalidArgumentException $e) {
            $this->error('バリデーションエラー: '.$e->getMessage());

            return self::FAILURE;
        }

        // 結果表示
        $this->newLine();

        if (! $result->successes->isEmpty()) {
            $this->info('✅ Google Calendar 同期成功:');
            $this->table(
                ['日付', 'シフト種別'],
                array_map(fn (array $s): array => [$s['date'], $s['type']], $result->successes->toArray()),
            );
        }

        if (! $result->failures->isEmpty()) {
            $this->warn('⚠️  Google Calendar 同期失敗（DBへの保存は完了済み）:');
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

    /**
     * --shifts オプションが未指定の場合、インタラクティブに入力を促す。
     *
     * @return list<string>
     */
    private function promptShiftsInteractively(): array
    {
        $validTypes = implode(', ', array_column(ShiftType::cases(), 'value'));
        $this->line("シフト種別の選択肢: {$validTypes}");
        $this->line('シフトを「日付:種別」形式で入力してください（例: 2026-03-10:office）。');
        $this->line('入力を終えたら空エンターで確定します。');

        $inputs     = [];
        while (true) {
            $input    = $this->ask('シフト (空エンターで終了)');
            if ($input === null || $input === '') {
                break;
            }
            $inputs[] = $input;
        }

        return $inputs;
    }

    /**
     * "YYYY-MM-DD:type" 形式の文字列配列を shifts 配列に変換する。
     *
     * @param  list<string>  $options
     * @return list<array{date:string,type:string}>|null パースエラー時は null
     */
    private function parseShiftOptions(array $options): ?array
    {
        $shifts     = [];
        $validTypes = array_column(ShiftType::cases(), 'value');

        foreach ($options as $option) {
            $parts         = explode(':', (string) $option, 2);

            if (count($parts) !== 2) {
                $this->error("フォーマットエラー: 「{$option}」は「日付:種別」形式で指定してください（例: 2026-03-10:office）");

                return null;
            }

            [$date, $type] = $parts;

            if (! preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
                $this->error("日付フォーマットエラー: 「{$date}」は Y-m-d 形式で指定してください");

                return null;
            }

            if (! in_array($type, $validTypes, true)) {
                $this->error("シフト種別エラー: 「{$type}」は無効です。選択肢: ".implode(', ', $validTypes));

                return null;
            }

            $shifts[]      = ['date' => $date, 'type' => $type];
        }

        if ($shifts === []) {
            $this->error('シフトが1件も入力されていません。');

            return null;
        }

        return $shifts;
    }
}
