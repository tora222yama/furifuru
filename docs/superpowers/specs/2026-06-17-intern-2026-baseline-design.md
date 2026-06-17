# intern-2026 ベースライン設計

作成日: 2026-06-17 / 対象ブランチ: `feature/intern-2026`（起点: `develop`）

## 目的

インターン向けのベースラインとして、**シフト関連機能を追加する前の状態**にアプリを戻しつつ、**使用ライブラリのバージョンをなるべく引き上げた**状態のリポジトリを用意する。

## 方針の決定（確定事項）

| 論点 | 決定 |
|---|---|
| 戻し方 | 現 `develop` を起点にブランチを切り、**シフト機能を外科的に削除**する。シフト導入前の過去コミットへは戻さない |
| 理由 | シフト機能(`834839a`〜)は React19 化・テーマ変更・betaバッジ・メニュー整理・テスト基盤整備などと履歴上深く交錯。過去コミットへ戻すとこれら非シフトの成果（特に React19 化＝アップグレード）まで失われ、「ライブラリは引き上げる」目的と矛盾するため |
| ライブラリ範囲 | **低リスクのみ最新化**を先行。MUI 6→9、Apollo Client 3→4 は破壊的変更が大きいため本ブランチでは対象外（別途・段階的に判断） |
| 進め方 | 「シフト削除」を1コミット（テストが通る状態）→ その後「ライブラリアップ」を段階的に別コミット |

## スコープ1: シフト機能の削除

### 完全削除するシフト専用ファイル

- **Services**: `app/Services/Shift/` 配下一式（Domain / Infrastructure / UseCase）
- **Controllers**: `app/Http/Controllers/Pages/ShiftScheduleController.php`、`app/Http/Controllers/Api/ShiftScheduleApiController.php`
- **Models**: `app/Models/App/Trn/TrnShiftSchedule.php`、`TrnUserShiftSetting.php`
- **その他PHP**: `app/Constant/ShiftScheduleConstant.php`、`app/Exceptions/ShiftEntryValidationException.php`、`app/Http/Requests/ShiftStoreRequest.php`、`app/Enum/App/ECalendarSyncStatus.php`、`app/Console/Commands/Shift/SyncShiftCalendar.php`、`app/Console/Commands/Test/RegisterShift.php`
- **Migrations**: `2026_03_02_000001_create_trn_shift_schedule_table.php`、`2026_03_03_000001_create_trn_user_shift_settings_table.php`
- **Factories**: `database/factories/TrnUserShiftEntryFactory.php`
- **React**: `resources/script/Pages/ShiftSchedule/` 配下一式
- **テスト**: `tests/Feature/Services/Shift/`、`tests/Feature/Api/ShiftScheduleApiControllerTest.php`、`tests/Unit/Services/Shift/`、`tests/Unit/Collections/ShiftEntriesTest.php`、`tests/Unit/ValueObjects/ShiftEntryTest.php`、`tests/Fakes/Shift/`
- **ドキュメント**: `document/features/SHIFT_SCHEDULE.md`、`SHIFT_SCHEDULE_API.md`、`SHIFT_SCHEDULE_API_OPERATIONS.md`、`wportal2-app/public/api-docs/shift-schedule.html`、`shift-schedule.openapi.yaml`

### GAS連携トークン管理（シフト専用と確定 → 削除）

`HasApiTokens` は GAS連携コミット `5ec485f` で追加。api ルートのうちシフト以外は healthcheck/deployed/user(既定) のみ。よって以下も削除:

- `app/Http/Controllers/Admin/ApiTokenManagementController.php`
- `resources/script/Pages/Admin/ApiTokenManagement.tsx`、`ApiTokenShow.tsx`
- `AuthUser` の `HasApiTokens` トレイト使用箇所
- `database/migrations/2026_05_18_000001_create_personal_access_tokens_table.php`、`2026_06_05_000001_add_expires_at_to_personal_access_tokens_table.php`
- `tests/Feature/Admin/ApiTokenManagementControllerTest.php`
- Sanctum の config（`config/sanctum.php` 等）は Laravel 初期スケルトン由来のため**残置**（無害）

### 一部修正する共有ファイル

- `app/Enum/App/EPages.php`: `SHIFT_SCHEDULE` 系 case と `getInvokePath()` の該当 case を削除
- `resources/script/Enum/Server/App/EPages.ts`: 上記に対応する const/`getHref()` を削除（※ `tool:MakeTypescriptEnum` で再生成が正しいが、PHP側削除後に再生成で整合）
- `resources/script/Enum/EMenu.ts`: `E_MENU.SHIFT_SCHEDULE` 定義と MenuList の該当エントリ削除
- `resources/script/Component/Drawer/DrawerItem.tsx`: シフト固有の分岐があれば削除
- `routes/web.php`: 73行〜の `/shift_schedule` グループ、173行〜の `/api-tokens` グループを削除
- `routes/api.php`: `ShiftScheduleApiController` use と `shift_schedule` ルートを削除（healthcheck/deployed/user は残す）
- `app/Providers/AppServiceProvider.php`: 9-12行の use と 24-25行の bind を削除

## スコープ2: ライブラリアップグレード（低リスクのみ）

シフト削除完了・テスト緑化の後、1つずつ上げて検証ゲートを通す。各アップ後に `npm run tsc` / `eslint` / `build`（フロント）、`pint` / `phpstan` / `php artisan test`（PHP）を実行し、緑を確認してからコミット。

### フロントエンド（npm 最新を確認済み）

低リスク群（個別コミット推奨）:
- typescript 5.9 → 6.0
- vite 7.3 → 8.0 / @vitejs/plugin-react 5.1 → 6.0 / laravel-vite-plugin 2.1 → 3.1
- eslint 9.16 → 10.5 / typescript-eslint・@eslint/js 等の追従
- react / react-dom: `^19.0` のままで 19.2 系を取得（実害なし、lock 更新のみ）
- graphql-codegen 系、その他パッチ/マイナー

要検証（低リスク寄りだが破壊的変更あり得る、ダメなら見送り）:
- @inertiajs/react 2.0 → 3.0: クライアントのみでなく `inertiajs/inertia-laravel` 側の対応バージョンと整合が必要。両者を揃えられ、SSR含め動作確認できた場合のみ採用。問題があれば 2 系据え置き

**対象外（本ブランチでは上げない）**: @mui/material・@mui/icons-material 6→9、@apollo/client 3→4

### PHP / composer

本サンドボックスから packagist へ接続できないため、最新版の確定と更新は**コンテナ内**で実施する。目標:
- PHP `^8.3` → 8.4 系（CI/Docker イメージの対応確認後）
- laravel/framework `^11.0` → 12 系（対応する larastan / nunomaduro/collision / phpunit 等も追従）
- lighthouse / sanctum / inertia-laravel / ide-helper 等は Laravel 12 互換の最新へ
- 各アップ後に `pint` / `phpstan (level 8)` / `php artisan test` 緑を確認

## テスト・検証戦略

1. シフト削除後: 全テストスイート（Unit/Feature）が緑。`tsc`/`eslint`/`build`/SSR 起動確認。`phpstan`/`pint` 緑。残存するシフト参照（grep `shift`/`Shift`/`シフト`）がゼロであること
2. 各ライブラリアップ後: 上記検証ゲートを都度通す。1ライブラリ=1コミットを基本とし、破壊的変更でロールバックしやすくする

## 想定外・留意点

- `npm run gen`（GraphQL codegen）・`tool:MakeTypescriptEnum`・ide-helper 等の生成物は、対応する手動編集後に再生成してコミットする（lefthook フックの整合）
- composer 系のメジャーアップ（Laravel 12）は破壊的変更の可能性があり、低リスク方針の範囲内で「上げられる所まで」とする。問題が出れば 11 据え置きを許容
- マイグレーション削除に伴い、テスト用 DB の再構築が必要
