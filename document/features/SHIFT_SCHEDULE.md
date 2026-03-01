# シフト管理機能 設計メモ

## 概要

ユーザーが月次シフト（出社・在宅・出張・休暇）を登録・参照する機能。
DBをデータのソース・オブ・トゥルース（SoT）とし、Googleカレンダーへの反映はベストエフォートで行う。

---

## アーキテクチャ

### レイヤー構成

```
[HTTP]
  ShiftScheduleController
    │
    ├── [参照] ShiftScheduleQueryService
    │             └── ShiftScheduleRepositoryInterface
    │                       └── ShiftScheduleRepository → DB
    │
    └── [登録] ShiftRegistrationUseCase
                  ├── ShiftScheduleRepositoryInterface → DB（TX内）
                  └── GoogleCalendarServiceInterface → Google Calendar API（TX外）

[Artisan / cron]
  shift:sync-calendar {email}
    └── SyncShiftCalendarUseCase
          ├── ShiftScheduleRepositoryInterface → DB（getAllShifts / updateSyncStatuses）
          └── GoogleCalendarServiceInterface → Google Calendar API（TX外・ベストエフォート）
```

### 設計上のポイント

- **QueryService に Interface を設けない**
  Controller が具体クラス `ShiftScheduleQueryService` に直接依存。
  読み取りはリポジトリの Fake で十分テスト可能なため、Interface による抽象化は不要と判断。

- **Repository には Interface を設ける**
  `ShiftScheduleRepositoryInterface` を定義。
  UseCase・QueryService のテストで `FakeShiftScheduleRepository` に差し替えられるようにする。

- **UseCase を読み書き共通の窓口としない**
  書き込みは `ShiftRegistrationUseCase`（UseCase層）、読み取りは `ShiftScheduleQueryService`（Query層）と分離。
  非対称に見えるが、将来的に読み取り側も複雑化した場合は QueryService にロジックを追加するだけでよい。

---

## DB設計

### `trn_shift_schedule` テーブル

| カラム | 型 | 説明 |
|---|---|---|
| `id` | bigint PK | |
| `trn_user_id` | int | `trn_user.id` への参照（FK制約なし、アプリ層で保証） |
| `shift_date` | date | シフト日 |
| `shift_type` | varchar(32) | `ShiftType` enum値（後述） |
| `e_calendar_sync_status` | int | カレンダー同期ステータス（後述） |
| `created_at` / `updated_at` | timestamp | |

**インデックス・制約**
- `(trn_user_id, shift_date)` UNIQUE 制約（同一ユーザー・同一日に1件のみ保証）
- `trn_user_id` 単独インデックス

**`e_archive_level` を設けない理由**
他テーブルで `e_archive_level` による論理削除が使われているのは「エンティティの変更履歴を残す」目的のため。
シフトスケジュールは「月次の現在状態」であり、旧データの履歴参照は不要。
ソフトデリートにすると読まれることのないアーカイブレコードが蓄積するだけになるため、物理削除（DELETE）を採用する。

---

## Enum

### `ShiftType`（ValueObject / PHP backed enum）

| 値 | 説明 |
|---|---|
| `office` | 出社 |
| `remote` | 在宅 |
| `businessTrip` | 出張 |
| `holiday` | 休暇 |

場所: `App\ValueObjects\ShiftType`

### `ECalendarSyncStatus`（App Enum / int backed enum）

| 値 | 定数 | 説明 |
|---|---|---|
| `1` | `PENDING` | DB登録済み・未同期（登録直後の初期値） |
| `2` | `SYNCED` | Google Calendar 同期済み |
| `3` | `FAILED` | Google Calendar 同期失敗（要リトライ） |

場所: `App\Enum\App\ECalendarSyncStatus`

---

## シフト登録フロー（`ShiftRegistrationUseCase::execute()`）

```
1. ShiftEntries::fromArray() でバリデーション・VO変換
   └── 空の場合は即 ShiftSyncResult(empty, empty) を返す

2. [DB TX] replaceMonthlyShifts()
   ├── 既存の当月レコードを DELETE
   └── 新レコードを PENDING でバルク INSERT
   → TX commit

3. [TX外・ベストエフォート] Google Calendar 同期
   ├── deleteGoogleCalendarMonth() : 当月のシフトイベントを削除
   └── syncShifts() : 各シフトをカレンダーに登録
       ├── 終日イベント（blockSchedule）
       └── 時刻付きイベント（blockSchedule）

4. updateSyncStatuses()
   ├── 成功分 → SYNCED
   └── 失敗分 → FAILED

5. ShiftSyncResult(successes, failures) を返す
```

---

## 再同期フロー（`SyncShiftCalendarUseCase::execute()`）

```
1. getAllShifts(trnUserId)  ← 全ステータス（PENDING / FAILED / SYNCED）を対象
   └── 空なら ShiftSyncResult(empty, empty) を返す

2. 対象月を列挙し、月ごとに deleteGoogleCalendarMonth()
   └── マーカー付きシフトイベントを一掃（Google側の手動変更も上書き）

3. syncShifts() : DB のシフトでカレンダーを再作成
   ├── 終日イベント（blockSchedule）
   └── 時刻付きイベント（blockSchedule）

4. updateSyncStatuses()
   ├── 成功分 → SYNCED
   └── 失敗分 → FAILED

5. ShiftSyncResult(successes, failures) を返す
```

**ShiftRegistrationUseCase との違い**
| | ShiftRegistrationUseCase | SyncShiftCalendarUseCase |
|---|---|---|
| 入力 | 全シフト配列 | DB の全シフト（ステータス問わず）|
| DB 書き込み | replaceMonthlyShifts（TX内） | なし（ステータス更新のみ） |
| カレンダー削除 | 当月を一括削除してから再登録 | 同上（DB の全月を月単位で削除→再登録） |
| 複数月対応 | 同一月のみ（制約あり） | 複数月にまたがっても可 |

---

## シフト参照フロー（`ShiftScheduleQueryService::getMonthlyShifts()`）

```
ShiftScheduleQueryService::getMonthlyShifts(trnUserId, targetMonth)
  └── ShiftScheduleRepository::getMonthlyShifts()
        └── SELECT * FROM trn_shift_schedule
              WHERE trn_user_id = ?
              AND shift_date BETWEEN ? AND ?
              ORDER BY shift_date
```

---

## Google Calendar イベント仕様

シフト1件につき **2種類のイベント** を登録する。

| 種類 | 時間帯 | 備考 |
|---|---|---|
| 終日イベント | 終日 | カレンダー上の視認性向上のため |
| 時刻付きイベント（休暇以外） | 05:00〜10:00 | ブロック用 |
| 時刻付きイベント（休暇） | 09:00〜18:00 | ブロック用 |

**シフトイベントの識別方法**
description の先頭に `[SHIFT_SYNC]`（`ShiftScheduleConstant::MARKER`）を付与する。
削除・一覧取得時はこのマーカーでシフトイベントと通常イベントを区別する。

---

## ファイル一覧

### 新規作成（今回の実装）

| ファイル | 役割 |
|---|---|
| `database/migrations/2026_03_02_000001_create_trn_shift_schedule_table.php` | マイグレーション |
| `app/Enum/App/ECalendarSyncStatus.php` | 同期ステータス Enum |
| `app/Models/App/Trn/TrnShiftSchedule.php` | Eloquent Model |
| `app/Services/Shift/ShiftScheduleRepositoryInterface.php` | Repository Interface |
| `app/Services/Shift/ShiftScheduleRepository.php` | Repository 実装 |
| `tests/Fakes/Shift/FakeShiftScheduleRepository.php` | テスト用 Fake |
| `app/Console/Commands/Test/RegisterShift.php` | 動作確認用 Artisan コマンド |
| `app/Dto/Shift/SyncShiftCalendarCommand.php` | 再同期 UseCase の入力 DTO |
| `app/Services/Shift/SyncShiftCalendarUseCase.php` | 再同期ユースケース |
| `app/Console/Commands/Shift/SyncShiftCalendar.php` | 再同期 Artisan コマンド（`shift:sync-calendar`） |
| `tests/Feature/Services/Shift/SyncShiftCalendarUseCaseTest.php` | 再同期 UseCase テスト |

### 既存ファイル（今回修正）

| ファイル | 変更内容 |
|---|---|
| `app/Services/Shift/ShiftRegistrationUseCase.php` | Repository DI 追加・DB保存処理・同期ステータス更新処理追加 |
| `app/Services/Shift/ShiftScheduleQueryService.php` | Google Calendar 依存を除去し Repository に委譲。Interface の実装を外した |
| `app/Http/Controllers/Pages/ShiftScheduleController.php` | `index()`でも`trnUser->id`を取得して QueryService に渡すよう変更 |
| `app/Providers/AppServiceProvider.php` | `ShiftScheduleRepositoryInterface` のバインディングを追加 |
| `tests/Feature/Services/Shift/ShiftRegistrationUseCaseTest.php` | FakeRepository を使うよう更新。DB保存・ステータス更新のアサーションを追加 |
| `tests/Unit/Services/Shift/ShiftScheduleQueryServiceTest.php` | FakeRepository ベースのテストに全面書き換え |
| `app/Services/Shift/ShiftScheduleRepositoryInterface.php` | `getPendingOrFailedShifts()` / `getAllShifts()` を追加 |
| `app/Services/Shift/ShiftScheduleRepository.php` | `getPendingOrFailedShifts()` / `getAllShifts()` を実装 |
| `tests/Fakes/Shift/FakeShiftScheduleRepository.php` | `getPendingOrFailedShifts()` / `seedPendingOrFailed()` / `getAllShifts()` / `seedAll()` を追加 |

### 削除

| ファイル | 理由 |
|---|---|
| `app/Services/Shift/ShiftScheduleQueryServiceInterface.php` | Controller が具体クラスに直接依存する設計に変更したため不要 |

---

## 動作確認コマンド

```bash
# シフト登録（動作確認用）
# オプション指定
php artisan test:register-shift user@example.com \
  --shifts=2026-03-10:office \
  --shifts=2026-03-11:remote \
  --shifts=2026-03-12:holiday

# インタラクティブ入力
php artisan test:register-shift user@example.com
```

シフト種別の選択肢: `office` / `remote` / `businessTrip` / `holiday`

```bash
# PENDING / FAILED シフトを Google Calendar に再同期
php artisan shift:sync-calendar user@example.com
```

---

---

## フロントエンド

### コンポーネント構成

```
Index
  └── ShiftSchedule
        └── MonthCalendar
              └── Day（× 日数分）
```

- **`Index`**: コントローラーから `shiftEntries` / `currentMonth` を受取り、`ShiftSchedule` へ props として渡す
- **`ShiftSchedule`**: ページレイアウト（`TypoH1` タイトル + `MonthCalendar`）
- **`MonthCalendar`**: 月ナビ・週ヘッダー・日付グリッド・送信ボタンを保持するメインコンポーネント
- **`Day`**: 1日分のセル。シフト種別の RadioGroup と祝日名を表示

### 型定義

場所: `resources/script/Pages/ShiftSchedule/Index.tsx`

```ts
export type ShiftType = 'remote' | 'office' | 'businessTrip' | 'holiday';

export type ShiftEntry = {
  date: string;    // 'yyyy-MM-dd'
  type: ShiftType;
};
```

- `ShiftEntry` はサーバーからの受信データ（`shiftEntries`）と送信ペイロード（`handleSubmit`）で共通して使用する

### カレンダー表示仕様

| 機能 | 仕様 |
|---|---|
| 初期表示月 | コントローラーから渡された `currentMonth`（`yyyy-MM` 形式）。未指定時は当月 |
| シフト初期値 | `shiftEntries` に含まれる日付はそのまま反映。未登録の日は平日→`remote`、土日祝→`holiday` をデフォルト表示 |
| 祝日の表示 | `japanese-holidays` の `isHoliday()` で判定し、祝日名を日付と同行・右寄せ・赤テキストで表示 |
| 送信 | 当月全日付分の `ShiftEntry[]` を `console.log`（実APIとの接続は未実装） |

### フロントエンドのファイル一覧

| ファイル | 役割 |
|---|---|
| `resources/script/Pages/ShiftSchedule/Index.tsx` | エントリポイント。`ShiftEntry` / `ShiftType` 型を export |
| `resources/script/Pages/ShiftSchedule/ShiftSchedule.tsx` | ページレイアウト（タイトル + カレンダー） |
| `resources/script/Pages/ShiftSchedule/MonthCalendar/MonthCalendar.tsx` | 月カレンダー本体 |
| `resources/script/Pages/ShiftSchedule/MonthCalendar/Day.tsx` | 日付セル（シフト選択 + 祝日名） |

---

## 未実装（今後の課題）

| 機能 | 概要 |
|---|---|
| 再同期の定期実行 | `shift:sync-calendar` を cron（Laravel Scheduler 等）で定期実行する設定 |
| フロントエンド送信処理 | `handleSubmit` を実際の API（GraphQL / Inertia POST）に接続する |

---

## 実装履歴

### Phase 1: シフト DB 永続化・Google Calendar 同期（初回実装）

**概要**  
ShiftRegistrationUseCase に Repository 層を追加してシフトを DB に永続化し、Google Calendar 同期の結果を `e_calendar_sync_status` に反映する仕組みを構築した。

**新規作成**
- `database/migrations/2026_03_02_000001_create_trn_shift_schedule_table.php`
- `app/Enum/App/ECalendarSyncStatus.php`（PENDING / SYNCED / FAILED）
- `app/Models/App/Trn/TrnShiftSchedule.php`
- `app/Services/Shift/ShiftScheduleRepositoryInterface.php`
- `app/Services/Shift/ShiftScheduleRepository.php`
- `tests/Fakes/Shift/FakeShiftScheduleRepository.php`
- `app/Console/Commands/Test/RegisterShift.php`（`test:register-shift` コマンド）

**修正**
- `ShiftRegistrationUseCase`: Repository DI 追加・DB保存（TX内）・同期ステータス更新を追加
- `ShiftScheduleQueryService`: Google Calendar 依存を除去し Repository に委譲。Interface 実装を外した
- `ShiftScheduleController`: `index()` でも `trnUser->id` を取得して QueryService に渡すよう変更
- `AppServiceProvider`: `ShiftScheduleRepositoryInterface` のバインディングを追加
- `ShiftRegistrationUseCaseTest`: FakeRepository ベースに全面更新
- `ShiftScheduleQueryServiceTest`: FakeRepository ベースのテストに全面書き換え

**削除**
- `app/Services/Shift/ShiftScheduleQueryServiceInterface.php`（Controller が具体クラスに直接依存する設計に変更したため不要）

---

### Phase 2: 再同期ユースケース実装

**概要**  
`e_calendar_sync_status = PENDING | FAILED` のシフトを Google Calendar に再同期する `SyncShiftCalendarUseCase` と Artisan コマンド `shift:sync-calendar` を実装した。

**新規作成**
- `app/Dto/Shift/SyncShiftCalendarCommand.php`
- `app/Services/Shift/SyncShiftCalendarUseCase.php`
- `app/Console/Commands/Shift/SyncShiftCalendar.php`（`shift:sync-calendar {email}` コマンド）
- `tests/Feature/Services/Shift/SyncShiftCalendarUseCaseTest.php`

**修正**
- `ShiftScheduleRepositoryInterface`: `getPendingOrFailedShifts()` を追加
- `ShiftScheduleRepository`: `getPendingOrFailedShifts()` を実装
- `FakeShiftScheduleRepository`: `getPendingOrFailedShifts()` / `seedPendingOrFailed()` を追加

---

### Phase 3: 再同期を全シフト対象・完全上書きに変更

**概要**  
Google Calendar 側で手動変更されている可能性を考慮し、`SyncShiftCalendarUseCase` の動作を以下のように変更した。

| | 変更前（Phase 2） | 変更後（Phase 3） |
|---|---|---|
| 対象シフト | PENDING / FAILED のみ | 全ステータス（DB 全件） |
| 月削除 | なし（追加のみ） | あり（月ごとに削除→再作成） |
| Google 側の手動変更 | 上書きしない | 上書きして DB を SoT に保つ |
| 複数月対応 | 可 | 可（月ごとに独立して削除実行） |

**修正**
- `ShiftScheduleRepositoryInterface`: `getAllShifts()` を追加
- `ShiftScheduleRepository`: `getAllShifts()` を実装（ステータス条件なし・日付昇順）
- `FakeShiftScheduleRepository`: `getAllShifts()` / `seedAll()` / `getAllShiftsCalls` を追加
- `SyncShiftCalendarUseCase`: `getPendingOrFailedShifts()` → `getAllShifts()` に変更。`deleteMonthsFromCalendar()` で月ごとにカレンダー削除を追加
- `SyncShiftCalendarUseCaseTest`: 全テストを新フローに更新（`deleteCalls` の検証追加、`seedAll()` 使用）

`getPendingOrFailedShifts()` は将来の軽量再同期（削除なし・差分のみ）等に備えて残してある。

---

### Phase 4: isShiftEvent の null description バグ修正

**概要**  
Google Calendar 上に description が設定されていない予定（通常の会議・予定など）が存在する場合、シフトの再登録時に旧イベントが削除されずに重複登録される不具合を修正した。

**原因**  
`isShiftEvent()` 内で `$event->getDescription()` が `null` を返す場合、`str_contains(null, '[SHIFT_SYNC]')` が `TypeError` を投げ、`deleteGoogleCalendarMonth()` の try/catch に捕捉されて削除処理全体がスキップされていた。その後 `syncShifts()` が新規イベントを登録するため、旧イベントと重複した。

```
// 修正前
return $description !== '' && str_contains($description, ShiftScheduleConstant::MARKER);
//                  ^^^^^  空文字ガードのみ → null は TypeError

// 修正後
return $description !== null && str_contains($description, ShiftScheduleConstant::MARKER);
//                   ^^^^^^  null ガード
```

**修正**
- `ShiftRegistrationUseCase::isShiftEvent()`: `!== ''` → `!== null`
- `SyncShiftCalendarUseCase::isShiftEvent()`: 同上
- `ShiftScheduleRepositoryInterface` doc comment: 「既存をアーカイブして」→「既存を物理削除して」（過去の設計メモの残存を修正）

**テスト**
- `FakeGoogleCalendarService`: フィルタを実際に適用して `$deletedEvents` に記録するよう更新
- `ShiftRegistrationUseCaseTest`: `test_execute_does_not_throw_when_calendar_has_null_description_event` を追加（回帰テスト）
