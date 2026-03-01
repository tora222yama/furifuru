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

**トランザクション整合性方針**
- DB書き込みのみトランザクション管理する
- Google Calendar API の失敗は DB データに影響しない
- カレンダー同期に失敗しても Controller は `stored_with_errors` ステータスでフロントに通知できる
- `PENDING` / `FAILED` レコードを対象にした再同期は将来の `SyncShiftCalendarUseCase`（未実装）で行う

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

### 既存ファイル（今回修正）

| ファイル | 変更内容 |
|---|---|
| `app/Services/Shift/ShiftRegistrationUseCase.php` | Repository DI 追加・DB保存処理・同期ステータス更新処理追加 |
| `app/Services/Shift/ShiftScheduleQueryService.php` | Google Calendar 依存を除去し Repository に委譲。Interface の実装を外した |
| `app/Http/Controllers/Pages/ShiftScheduleController.php` | `index()`でも`trnUser->id`を取得して QueryService に渡すよう変更 |
| `app/Providers/AppServiceProvider.php` | `ShiftScheduleRepositoryInterface` のバインディングを追加 |
| `tests/Feature/Services/Shift/ShiftRegistrationUseCaseTest.php` | FakeRepository を使うよう更新。DB保存・ステータス更新のアサーションを追加 |
| `tests/Unit/Services/Shift/ShiftScheduleQueryServiceTest.php` | FakeRepository ベースのテストに全面書き換え |

### 削除

| ファイル | 理由 |
|---|---|
| `app/Services/Shift/ShiftScheduleQueryServiceInterface.php` | Controller が具体クラスに直接依存する設計に変更したため不要 |

---

## 動作確認コマンド

```bash
# オプション指定
php artisan test:register-shift user@example.com \
  --shifts=2026-03-10:office \
  --shifts=2026-03-11:remote \
  --shifts=2026-03-12:holiday

# インタラクティブ入力
php artisan test:register-shift user@example.com
```

シフト種別の選択肢: `office` / `remote` / `businessTrip` / `holiday`

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
| `SyncShiftCalendarUseCase` | `e_calendar_sync_status = PENDING\|FAILED` のレコードを対象に Google Calendar へ再同期するユースケース |
| 再同期の起動方式 | バッチ／キュー（Artisan コマンド or Laravel Queue）での定期実行を想定 |
| フロントエンド送信処理 | `handleSubmit` を実際の API（GraphQL / Inertia POST）に接続する |
