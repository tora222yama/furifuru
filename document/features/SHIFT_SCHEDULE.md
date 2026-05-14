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
                  ├── ShiftSettingsRepository           → DB（TX内・勤務開始時刻 upsert）
                  └── ShiftCalendarSyncer               → Google Calendar API（TX外）
                            └── GoogleCalendarServiceInterface

[Artisan / cron]
  shift:sync-calendar {email} {month}
    └── SyncShiftCalendarUseCase
          ├── ShiftScheduleRepositoryInterface  → DB（getMonthlyShifts / updateSyncStatuses）
          ├── ShiftSettingsRepository           → DB（findOrDefault・開始時刻取得）
          └── ShiftCalendarSyncer               → Google Calendar API（TX外・ベストエフォート）
                    └── GoogleCalendarServiceInterface
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

- **カレンダー処理を `ShiftCalendarSyncer` に集約**
  `ShiftRegistrationUseCase` と `SyncShiftCalendarUseCase` が共通して使うカレンダー操作（削除→再作成）を
  `ShiftCalendarSyncer` に切り出し、両 UseCase から呼び出す。`isShiftEvent()` 等の判定ロジックもここに集約される。

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

### `trn_user_shift_setting` テーブル

| カラム | 型 | 説明 |
|---|---|---|
| `id` | bigint PK | |
| `trn_user_id` | int | `trn_user.id` への参照（FK制約なし）|
| `office_start_time` | varchar(5) | 出社の勤務開始時刻（例: `"09:30"`）|
| `remote_start_time` | varchar(5) | 在宅の勤務開始時刻（例: `"10:00"`）|
| `created_at` / `updated_at` | timestamp | |

- `trn_user_id` UNIQUE 制約（1ユーザー1レコード）
- 未設定時のデフォルトは `09:00`（`ShiftStartSettings::DEFAULT_TIME`）
- 許容値は `08:00` 〜 `12:00` の 30分刻り（`ShiftStartSettings::ALLOWED` 参照）

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

### `ShiftStartSettings`（ValueObject）

| フィールド | 型 | 説明 |
|---|---|---|
| `officeStartTime` | string | 出社の勤務開始時刻（`HH:MM` 形式）|
| `remoteStartTime` | string | 在宅の勤務開始時刻（`HH:MM` 形式）|

許容値: `08:00` / `08:30` / `09:00` / `09:30` / `10:00` / `10:30` / `11:00` / `11:30` / `12:00`  
デフォルト: `09:00`（`ShiftStartSettings::default()` で生成）

場所: `App\ValueObjects\ShiftStartSettings`  
関連: `ShiftSettingsRepository`（`upsert` / `findOrDefault`）、`TrnUserShiftSetting` Model

---

## シフト登録フロー（`ShiftRegistrationUseCase::execute()`）

```
1. ShiftEntries::fromArray() でバリデーション・VO変換
   └── 空の場合は即 ShiftSyncResult(empty, empty) を返す

2. [DB TX]
   ├── replaceMonthlyShifts()  : 既存の当月レコードを DELETE → 新レコードを PENDING でバルク INSERT
   └── shiftSettingsRepository.upsert()  : 勤務開始時刻設定を upsert
   → TX commit

3. [TX外・ベストエフォート] ShiftCalendarSyncer::replaceCalendarMonth()
   ├── deleteGoogleCalendarMonth() : 当月のシフトイベントを削除
   └── syncShifts() : 各シフトをカレンダーに登録（startSettings の時刻を使用）
       ├── 終日イベント（blockSchedule）
       └── 時刻付きイベント（blockSchedule）

4. updateSyncStatuses()
   ├── 成功分 → SYNCED
   └── 失敗分 → FAILED

5. ShiftSyncResult(successes, failures) を返す
```

---

## 再同期フロー（`SyncShiftCalendarUseCase::execute()`）

`SyncShiftCalendarCommand` に `targetMonth`（`CarbonImmutable`）を渡すことで **指定月のみ** を対象に再同期する。

```
1. getMonthlyShifts(trnUserId, targetMonth)  ← 全ステータス（PENDING / FAILED / SYNCED）を対象
   └── 空なら ShiftSyncResult(empty, empty) を返す

2. shiftSettingsRepository.findOrDefault(trnUserId) で勤務開始時刻設定を取得

3. ShiftCalendarSyncer::replaceCalendarMonth()
   ├── deleteGoogleCalendarMonth() : 指定月のシフトイベントを一掃
   │     └── マーカー付きイベントのみ削除（Google側の手動変更も上書き）
   └── syncShifts() : DB のシフトでカレンダーを再作成（startSettings の時刻を使用）
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
| 入力 | 全シフト配列（フロントエンド POST） | DB のシフト（指定月・全ステータス）|
| DB 書き込み | replaceMonthlyShifts + upsertSettings（TX内） | なし（ステータス更新のみ） |
| 開始時刻 | コマンドに含む（ユーザー指定） | DB から findOrDefault で取得 |
| カレンダー削除 | 当月を一括削除してから再登録 | 同上（指定月を削除→再登録） |
| 複数月対応 | 同一月のみ（制約あり） | 同一月のみ（月指定） |

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
| 時刻付きイベント（休暇以外） | `startTime` 〜 `startTime + 5h` | ブロック用。`startTime` は `ShiftStartSettings` で設定 。`eventType: outOfOffice` |
| 時刻付きイベント（休暇） | 05:00〜22:00 | ブロック用（固定）。`eventType: rest`（終日イベントと同じ） |

**シフトイベントの識別方法**
description の先頭に `[SHIFT_SYNC]`（`ShiftScheduleConstant::MARKER`）を付与する。
削除・一覧取得時はこのマーカーでシフトイベントと通常イベントを区別する。

---

## ファイル一覧

### 新規作成（今回の実装）

| ファイル | 役割 |
|---|---|
| `database/migrations/2026_03_02_000001_create_trn_shift_schedule_table.php` | maイグレーション（`trn_shift_schedule`）|
| `database/migrations/xxxx_create_trn_user_shift_setting_table.php` | マイグレーション（`trn_user_shift_setting`）|
| `app/Enum/App/ECalendarSyncStatus.php` | 同期ステータス Enum |
| `app/Models/App/Trn/TrnShiftSchedule.php` | Eloquent Model |
| `app/Models/App/Trn/TrnUserShiftSetting.php` | Eloquent Model（勤務開始時刻設定）|
| `app/ValueObjects/ShiftStartSettings.php` | 勤務開始時刻設定 ValueObject |
| `app/Services/Shift/ShiftCalendarSyncer.php` | カレンダー操作の共通サービス（削除→再作成・`isShiftEvent` 判定）|
| `app/Services/Shift/ShiftScheduleRepositoryInterface.php` | Repository Interface |
| `app/Services/Shift/ShiftScheduleRepository.php` | Repository 実装 |
| `app/Services/Shift/ShiftSettingsRepository.php` | 勤務開始時刻設定 Repository |
| `tests/Fakes/Shift/FakeShiftScheduleRepository.php` | テスト用 Fake |
| `app/Console/Commands/Test/RegisterShift.php` | 動作確認用 Artisan コマンド |
| `app/Dto/Shift/ShiftRegistrationCommand.php` | 登録 UseCase の入力 DTO（`startSettings` を含む）|
| `app/Dto/Shift/SyncShiftCalendarCommand.php` | 再同期 UseCase の入力 DTO（`targetMonth` を含む）|
| `app/Http/Requests/ShiftStoreRequest.php` | store アクション用 FormRequest |
| `app/Services/Shift/SyncShiftCalendarUseCase.php` | 再同期ユースケース |
| `app/Console/Commands/Shift/SyncShiftCalendar.php` | 再同期 Artisan コマンド（`shift:sync-calendar {email} {month}`）|
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
# 指定月のシフトを Google Calendar に再同期（全ステータス対象・完全上書き）
php artisan shift:sync-calendar user@example.com 2026-03
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

- **`Index`**: コントローラーから `shiftEntries` / `currentMonth` / `startSettings` を受取り、`ShiftSchedule` へ props として渡す
- **`ShiftSchedule`**: ページレイアウト（`TypoH1` タイトル + `MonthCalendar`）
- **`MonthCalendar`**: 月ナビ・週ヘッダー・日付グリッド・送信ボタンを保持するメインコンポーネント
- **`Day`**: 1日分のセル。シフト種別の RadioGroup と祝日名を表示

### 型定義

**規約: `Index.tsx` をサーバー↔フロント間のインターフェース定義の唯一の場所とする**

Inertia のエントリーポイントである `Index.tsx` が「コントローラーが返す props の型」を集約して定義・export する。
子コンポーネントはページ層の型を `Index.tsx` から import して使い、独自に再定義しない。
これにより「サーバーとフロントが何をやり取りしているか」は `Index.tsx` を見るだけで把握できる。

```ts
// Index.tsx に集約する型

export type ShiftType = 'remote' | 'office' | 'businessTrip' | 'holiday';

/** DB の Google カレンダー同期ステータス（サーバーから渡される値） */
export type CalendarSyncStatus = 'pending' | 'synced' | 'failed';

/** フロントエンド表示用ステータス（未保存・未入力を含む） */
export type DisplaySyncStatus = CalendarSyncStatus | 'unsaved' | 'unregistered';

export type ShiftEntry = {
  date: string;    // 'yyyy-MM-dd'
  type: ShiftType;
  syncStatus?: CalendarSyncStatus; // DB 保存済みエントリのみ存在
};

export type ShiftSyncResult = {
  successes: ShiftEntry[];
  failures: ShiftEntry[];
};

/** 在宅・出社の勤務開始時刻設定 */
export type ShiftStartSettings = {
  officeStartTime: string;  // 'HH:MM'
  remoteStartTime: string;  // 'HH:MM'
};

/** 選択可能な開始時刻。'08:00'〜'12:00' の 30分刻り */
export const SHIFT_START_TIME_OPTIONS = ['08:00', '08:30', '09:00', ...] as const;
export type ShiftStartTime = (typeof SHIFT_START_TIME_OPTIONS)[number];

/** コントローラーが返す全 props の型 */
export type ShiftPageProps = {
  shiftEntries?: ShiftEntry[];
  currentMonth?: string;
  startSettings?: ShiftStartSettings;  // 勤務開始時刻設定（DB 未設定時はデフォルト値）
  shiftSync?: ShiftSyncResult;         // store 後のカレンダー同期結果（flash）
  flash?: { status?: string };         // 汎用ステータス（HandleInertiaRequests 経由）
};
```

- `ShiftEntry` はサーバーからの受信データ（`shiftEntries`）と送信ペイロード（`handleSubmit`）で共通して使用する
- 送信ペイロードに `syncStatus` は含まれない（`toArray()` には省略されるため）
- `startSettings` は Partial Reload 対象外（初回ロード時のみ取得）

### カレンダー表示仕様

| 機能 | 仕様 |
|---|---|
| 初期表示月 | コントローラーから渡された `currentMonth`（`yyyy-MM` 形式）。未指定時は当月 |
| シフト初期値 | `shiftEntries` に含まれる日付はそのまま反映。未登録の日は平日→`remote`、土日祝→`holiday` をデフォルト表示 |
| 祝日の表示 | `japanese-holidays` の `isHoliday()` で判定し、祝日名を日付と同行・右寄せ・赤テキストで表示 |
| 月移動 | 前後月ボタン押下で `router.get()` + Partial Reload（`only: ['shiftEntries', 'currentMonth']`）を実行。URL が `?month=YYYY-MM` に更新されブラウザ戻るボタンで月移動できる |
| 同期ステータスバッジ | 各日付セルに現在のステータスを小さい `Chip` で表示（詳細は下表） |
| 送信スキップ | 土日・祝日で `shiftData` に未登録かつユーザーが変更していない日は送信対象から除外する |
| 送信 | 対象日分の `ShiftEntry[]` と `officeStartTime` / `remoteStartTime` を `POST /shift_schedule/store` へ送信。ローディング表示→スナックバーで結果通知 |

### 同期ステータスバッジ仕様

| `DisplaySyncStatus` | ラベル | 色 | 表示条件 |
|---|---|---|---|
| `unregistered` | 未入力 | グレー | 平日・DB 未登録・ユーザー未変更 |
| `unsaved` | 未保存 | オレンジ | `shiftData` がサーバー値と異なる（未送信の変更あり） |
| `pending` | 未連携 | グレー | DB 登録済み・Google Calendar 未同期 |
| `synced` | 同期済 | 緑 | Google Calendar 同期完了 |
| `failed` | 連携失敗 | 赤 | Google Calendar 同期失敗 |
| (非表示) | — | — | 土日・祝日かつ DB 未登録・ユーザー未変更 |

**補足**: 平日で未入力（`unregistered`）かつ現在のシフト表示が `remote` のとき、「在宅」ラジオボタンにカーソルを合わせると「未入力のままでも送信時に在宅として同期されます」というツールチップを表示する。

### フロントエンドのファイル一覧

| ファイル | 役割 |
|---|---|
| `resources/script/Pages/ShiftSchedule/Index.tsx` | エントリポイント。`ShiftEntry` / `ShiftType` / `ShiftStartSettings` 等の型を集約して export |
| `resources/script/Pages/ShiftSchedule/ShiftSchedule.tsx` | ページレイアウト（タイトル + カレンダー） |
| `resources/script/Pages/ShiftSchedule/MonthCalendar/MonthCalendar.tsx` | 月カレンダー本体。勤務開始時刻の Select UI も含む |
| `resources/script/Pages/ShiftSchedule/MonthCalendar/Day.tsx` | 日付セル（シフト選択 + 祝日名 + 同期ステータスバッジ）|

---

## 未実装（今後の課題）

| 機能 | 概要 |
|---|---|
| 再同期の定期実行 | `shift:sync-calendar` を cron（Laravel Scheduler 等）で定期実行する設定 |
| 月移動時の shiftData 上書き防止（保存済み月の再訪） | 現状、一度別月に移動して戻ってきたとき `serverShiftData` がキャッシュされているため未変更の日はサーバー値で上書きされない。ただし変更済みの日もそのまま残るため整合性は保たれる |

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

### Phase 3: 再同期を指定月・完全上書きに変更

**概要**  
Google Calendar 側で手動変更されている可能性を考慮し、`SyncShiftCalendarUseCase` の動作を以下のように変更した。
`SyncShiftCalendarCommand` に `targetMonth` を持たせ、Artisan コマンドも `{email} {month}` を引数に取る形に変更した。

| | 変更前（Phase 2） | 変更後（Phase 3） |
|---|---|---|
| 対象シフト | PENDING / FAILED のみ | 全ステータス（指定月 DB 全件） |
| 月削除 | なし（追加のみ） | あり（指定月を削除→再作成） |
| Google 側の手動変更 | 上書きしない | 上書きして DB を SoT に保つ |
| 月指定 | 不可（全月） | `targetMonth` で指定 |

**修正**
- `SyncShiftCalendarUseCase`: `getPendingOrFailedShifts()` → `getMonthlyShifts(targetMonth)` に変更。`ShiftCalendarSyncer::replaceCalendarMonth()` で削除→再作成
- `SyncShiftCalendarCommand`: `targetMonth: CarbonImmutable` フィールドを追加
- `SyncShiftCalendarUseCaseTest`: 全テストを新フローに更新（`deleteCalls` の検証追加）
- `FakeShiftScheduleRepository`: テスト用シード・検証ヘルパーを整備

`getPendingOrFailedShifts()` は将来の軽量再同期（削除なし・差分のみ）等に備えて `ShiftScheduleRepositoryInterface` に残してある。

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
- `ShiftCalendarSyncer::isShiftEvent()`: `!== ''` → `!== null`（`isShiftEvent` は `ShiftCalendarSyncer` に集約されている）
- `ShiftScheduleRepositoryInterface` doc comment: 「既存をアーカイブして」→「既存を物理削除して」（過去の設計メモの残存を修正）

**テスト**
- `FakeGoogleCalendarService`: フィルタを実際に適用して `$deletedEvents` に記録するよう更新
- `ShiftRegistrationUseCaseTest`: `test_execute_does_not_throw_when_calendar_has_null_description_event` を追加（回帰テスト）

---

### Phase 5: フロントエンド送信処理の実装

**概要**  
`MonthCalendar` の送信ボタンを `console.log` + `alert` から実際の Inertia POST に接続した。
保存結果（成功 / 一部失敗）をスナックバーで通知する。

**新規作成**
- なし

**修正**
- `app/Enum/App/EPages.php`: `SHIFT_SCHEDULE__STORE` case を追加（`ShiftScheduleController@store`）
- `routes/web.php`: `Route::post('/store', ...)` を `shift_schedule` グループに追加
- `app/Http/Middleware/HandleInertiaRequests.php`: `share()` に `flash`（`status` / `shiftSync`）を追加。クロージャで遅延評価し、セッション未起動時の `Session store not set` エラーを回避
- `resources/script/Enum/Server/App/EPages.ts`: `SHIFT_SCHEDULE__STORE` と `getPagesHref` ケースを追加
- `resources/script/Pages/ShiftSchedule/MonthCalendar/MonthCalendar.tsx`: `handleSubmit` を `router.post()` に置き換え。`onSuccess` コールバックで `flash` を読んでスナックバー表示
- `resources/script/Pages/ShiftSchedule/MonthCalendar/Day.tsx`: `ShiftType` の import 先を `MonthCalendar.tsx` → `Index.tsx` に修正（既存バグ）

**トラブルシューティング記録**

| 事象 | 原因 | 対処 |
|---|---|---|
| `Session store not set on request` | `HandleInertiaRequests` がグローバルミドルウェア（`$middleware->append()`）のため `StartSession` より先に `share()` が評価される | `flash` の値をクロージャ `fn () => [...]` にして遅延評価に変更 |
| flash が常に null | 上記と同様の評価タイミング問題。`hasSession()` ガードでエラーは消えたが値が null のまま | クロージャ化で解決 |
| `router.post` + `useEffect` で flash が届かない | `useEffect` は `props.flash?.status` の変化を検知できないケースがある | `router.post()` の `onSuccess(page => ...)` コールバックで直接 `page.props.flash` を読む方式に変更 |

---

### Phase 6: Partial Reload による月移動と state 保持

**概要**  
月ナビゲーションボタン押下時に `router.get()` + Partial Reload で当月のシフトデータだけを再取得するよう変更した。
`preserveState: true` により React の state（`shiftData` 等のフォーム状態）はページ遷移を跨いで維持される。

**変更ファイル**
- `resources/script/Pages/ShiftSchedule/MonthCalendar/MonthCalendar.tsx`
  - `handlePrevMonth` / `handleNextMonth`: `setCurrentDate()` でUIを即時更新しつつ、`router.get('/shift_schedule', { month }, { only: ['shiftEntries', 'currentMonth'], preserveState: true, preserveScroll: true })` を呼ぶ
  - `useRef` + `useEffect` で `shiftEntries` の参照変化を検知。Partial Reload 完了時（props 更新時）にのみ `shiftData` をマージ更新する
  - **マージ戦略**: `shiftData` にすでにあるキー（ユーザーが変更済みの日付）は上書きしない。新規月のデータのみ追加

**設計上の判断**
- `setCurrentDate()` を先に呼ぶことで、通信完了前でもカレンダーUIが即時切り替わる（オプティミスティックUI）
- URL が `?month=YYYY-MM` に変わるためブラウザの「戻る」ボタンで月移動できる

---

### Phase 7: 同期ステータスバッジ表示

**概要**  
各日付セルに「未入力 / 未保存 / 未連携 / 同期済 / 連携失敗」を示す Chip バッジを追加し、
ユーザーが送信前・送信後のステータスを一目で把握できるようにした。

**変更ファイル**
- `app/ValueObjects/ShiftEntry.php`
  - コンストラクタに `?ECalendarSyncStatus $syncStatus = null` を追加
  - `toArray()` に `syncStatus` キーを追加（`null` の場合はキー自体を省略）
  - `fromArray()` は変更なし（リクエスト入力パスに影響しない）
- `app/Services/Shift/ShiftScheduleRepository.php`
  - `getMonthlyShifts()`: `ShiftEntries::fromArray()` から `new ShiftEntry(new ShiftDate(...), ShiftType::from(...), ECalendarSyncStatus::from(...))` による個別組み立てに変更し、`e_calendar_sync_status` を取得して `syncStatus` に渡す
- `resources/script/Pages/ShiftSchedule/Index.tsx`
  - `CalendarSyncStatus`（サーバー由来）・`DisplaySyncStatus`（表示用・未保存/未入力を含む）型を追加
  - `ShiftEntry` に `syncStatus?: CalendarSyncStatus` を追加
- `resources/script/Pages/ShiftSchedule/MonthCalendar/MonthCalendar.tsx`
  - `serverShiftData` state（サーバーが最後に返したシフト種別）を追加。Partial Reload 後は常に上書き
  - `syncStatusData` state（DB 由来の同期ステータス）を追加。Partial Reload 後は常に上書き
  - `getDisplaySyncStatus(dateStr, dateTime)`: ローカル変更の有無・土日祝判定を踏まえて `DisplaySyncStatus | undefined` を返すヘルパーを追加
- `resources/script/Pages/ShiftSchedule/MonthCalendar/Day.tsx`
  - `syncStatus?: DisplaySyncStatus` prop を追加
  - `SYNC_STATUS_CONFIG` マッピング（ラベル + MUI カラー）を定義
  - 日付ヘッダー直下に `height: '18px'` 固定の Box を設け、`syncStatus` がない場合も高さを確保してラジオボタンのズレを防ぐ
  - 平日・未入力（`unregistered`）かつ `shift === 'remote'` のとき「在宅」ラベルに `Tooltip` を表示

---

### Phase 8: 土日・祝日の未変更シフトを送信対象から除外

**概要**  
土日・祝日はデフォルトで `holiday` になるが、ユーザーが明示的に変更しない限りカレンダーに登録する必要がないため、送信ペイロードおよびバッジ表示の両方から除外するようにした。

**判断基準**: `shiftData[dateKey]` が `undefined`（DB未登録かつユーザー未変更）かつ `getDefaultShift(date) === 'holiday'`（土日または祝日）のとき対象外とする。

**変更ファイル**
- `resources/script/Pages/ShiftSchedule/MonthCalendar/MonthCalendar.tsx`
  - `handleSubmit`: 上記条件に合致する日付は `entries` に追加せず `continue` する
  - `getDisplaySyncStatus`: 上記条件のとき `undefined` を返してバッジも非表示にする

---

### Phase 9: 勤務開始時刻設定機能

**概要**  
Google Calendar のブロックイベントに使う「出社/在宅の勤務開始時刻」をユーザーごとに設定・保存できるようにした。
設定はシフト送信時に一緒に DB へ upsert され、再同期時（`SyncShiftCalendarUseCase`）でも参照される。

**新規作成**
- `app/ValueObjects/ShiftStartSettings.php`（`officeStartTime` / `remoteStartTime`。08:00〜12:00 の 30分刻り）
- `app/Models/App/Trn/TrnUserShiftSetting.php`（Eloquent Model）
- `app/Services/Shift/ShiftSettingsRepository.php`（`upsert` / `findOrDefault`）
- `database/migrations/xxxx_create_trn_user_shift_setting_table.php`

**修正**
- `ShiftRegistrationUseCase`: `ShiftSettingsRepository` を DI 追加。TX 内で `upsert()` を実行
- `SyncShiftCalendarUseCase`: `ShiftSettingsRepository` を DI 追加。`findOrDefault()` でスタートタイムを取得し `ShiftCalendarSyncer` に渡す
- `ShiftCalendarSyncer`: `replaceCalendarMonth()` / `syncShifts()` に `ShiftStartSettings` を受け取り、時刻付きイベントの開始時刻に反映
- `ShiftRegistrationCommand`: `startSettings: ShiftStartSettings` フィールドを追加
- `ShiftScheduleController`: `startSettings` を lazy prop として `index()` で返す。`store()` でリクエストから `officeStartTime` / `remoteStartTime` を取り出してコマンドに渡す
- `resources/script/Pages/ShiftSchedule/Index.tsx`: `ShiftStartSettings` / `SHIFT_START_TIME_OPTIONS` / `ShiftStartTime` 型を追加。`ShiftPageProps` に `startSettings` を追加
- `resources/script/Pages/ShiftSchedule/MonthCalendar/MonthCalendar.tsx`: `officeStartTime` / `remoteStartTime` の `useState` を追加。送信ペイロードに含める。勤務開始時刻を選択する UI（Select）を追加
