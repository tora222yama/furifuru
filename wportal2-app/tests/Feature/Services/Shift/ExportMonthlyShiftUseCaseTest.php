<?php

declare(strict_types=1);

namespace Tests\Feature\Services\Shift;

use App\Models\App\Auth\AuthUser;
use App\Models\App\Trn\TrnUser;
use App\Services\Shift\Domain\ShiftDate;
use App\Services\Shift\Domain\ShiftEntries;
use App\Services\Shift\Domain\ShiftEntry;
use App\Services\Shift\Domain\ShiftScheduleRepositoryInterface;
use App\Services\Shift\Domain\ShiftType;
use App\Services\Shift\UseCase\ExportMonthlyShiftCommand;
use App\Services\Shift\UseCase\ExportMonthlyShiftUseCase;
use Carbon\CarbonImmutable;
use Tests\Fakes\Shift\FakeShiftScheduleRepository;
use Tests\TestCase;

final class ExportMonthlyShiftUseCaseTest extends TestCase
{
    private FakeShiftScheduleRepository $fakeRepository;

    private ExportMonthlyShiftUseCase $useCase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->fakeRepository = new FakeShiftScheduleRepository;

        $this->app->instance(ShiftScheduleRepositoryInterface::class, $this->fakeRepository);

        $this->useCase        = new ExportMonthlyShiftUseCase($this->fakeRepository);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function createUser(array $attributes = []): TrnUser
    {
        $authUser = AuthUser::factory()->create(array_merge([
            'email'     => fake()->unique()->safeEmail(),
            'password'  => 'password',
            'google_id' => 'dummy-google-id',
        ], $attributes));

        return TrnUser::factory()->create(['auth_id' => $authUser->id]);
    }

    public function test_export_generates_header_row_with_all_dates(): void
    {
        $targetMonth = CarbonImmutable::parse('2026-04-01');
        $command     = new ExportMonthlyShiftCommand($targetMonth);

        $rows        = iterator_to_array($this->useCase->execute($command));

        // ヘッダー行
        $header      = $rows[0];
        $this->assertSame('名前', $header[0]);
        $this->assertSame('メール', $header[1]);
        $this->assertSame('2026-04-01', $header[2]);
        $this->assertSame('2026-04-30', $header[31]);
        $this->assertCount(32, $header); // 名前 + メール + 30日分
    }

    public function test_export_includes_user_shifts_in_japanese(): void
    {
        // テストユーザー作成
        $uniqueName  = 'CSVテスト_'.uniqid();
        $trnUser     = $this->createUser(['name' => $uniqueName]);
        /** @var \App\Models\App\Auth\AuthUser $authUser */
        $authUser    = $trnUser->AuthUser;
        $userEmail   = $authUser->email;

        // シフトをseed
        $entries     = ShiftEntries::empty();
        $entries->push(new ShiftEntry(new ShiftDate('2026-04-01'), ShiftType::Office));
        $entries->push(new ShiftEntry(new ShiftDate('2026-04-02'), ShiftType::Remote));
        $entries->push(new ShiftEntry(new ShiftDate('2026-04-03'), ShiftType::BusinessTrip));
        $entries->push(new ShiftEntry(new ShiftDate('2026-04-04'), ShiftType::Holiday));
        $this->fakeRepository->seed($trnUser->id, $entries);

        $targetMonth = CarbonImmutable::parse('2026-04-01');
        $command     = new ExportMonthlyShiftCommand($targetMonth);

        $rows        = iterator_to_array($this->useCase->execute($command));

        // ユーザーの行を探す
        $userRow     = collect($rows)->first(fn (array $row) => $row[0] === $uniqueName);

        $this->assertNotNull($userRow);
        $this->assertSame($userEmail, $userRow[1]); // メール
        $this->assertSame('出社', $userRow[2]);   // 04-01
        $this->assertSame('在宅', $userRow[3]);   // 04-02
        $this->assertSame('出張', $userRow[4]);   // 04-03
        $this->assertSame('休暇', $userRow[5]);   // 04-04
        $this->assertSame('', $userRow[6]);        // 04-05 未登録
    }

    public function test_export_shows_empty_for_user_without_shifts(): void
    {
        $uniqueName  = '未登録_'.uniqid();
        $trnUser     = $this->createUser(['name' => $uniqueName]);
        /** @var \App\Models\App\Auth\AuthUser $authUser */
        $authUser    = $trnUser->AuthUser;

        $targetMonth = CarbonImmutable::parse('2026-04-01');
        $command     = new ExportMonthlyShiftCommand($targetMonth);

        $rows        = iterator_to_array($this->useCase->execute($command));

        $userRow     = collect($rows)->first(fn (array $row) => $row[0] === $uniqueName);

        $this->assertNotNull($userRow);
        $this->assertSame($authUser->email, $userRow[1]);
        for ($i = 2; $i <= 31; $i++) {
            $this->assertSame('', $userRow[$i], "日付インデックス {$i} は空欄であるべき");
        }
    }

    public function test_export_sorts_users_by_name(): void
    {
        // 五十音順: あああ < かかか < ははは
        $suffix      = uniqid();
        $this->createUser(['name' => "かかか_{$suffix}"]);
        $this->createUser(['name' => "あああ_{$suffix}"]);
        $this->createUser(['name' => "ははは_{$suffix}"]);

        $targetMonth = CarbonImmutable::parse('2026-04-01');
        $command     = new ExportMonthlyShiftCommand($targetMonth);

        $rows        = iterator_to_array($this->useCase->execute($command));

        // ヘッダー除いたユーザー行の名前列を取得
        $names       = array_map(fn (array $row) => $row[0], array_slice($rows, 1));

        // あああ が かかか より前にくること
        $posA        = array_search("あああ_{$suffix}", $names, true);
        $posK        = array_search("かかか_{$suffix}", $names, true);
        $posH        = array_search("ははは_{$suffix}", $names, true);

        $this->assertLessThan($posK, $posA);
        $this->assertLessThan($posH, $posK);
    }
}
