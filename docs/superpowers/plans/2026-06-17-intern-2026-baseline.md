# intern-2026 ベースライン Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 現 `develop` から切った `feature/intern-2026` ブランチで、シフト関連機能（GAS連携APIトークン管理含む）を外科的に削除し、続けて低リスクなライブラリを段階的に最新化する。

**Architecture:** 過去コミットへは戻さず、現行コードからシフト機能のみを取り除く。React19化・テーマ・テスト基盤などの非シフト成果は維持。削除はまず1コミットにまとめ（テスト緑が条件）、その後ライブラリアップを1ライブラリ=1コミットで積み上げる。

**Tech Stack:** Laravel 11 / Inertia.js v2 / React 19 / Vite / MUI / GraphQL(Lighthouse) / PHPUnit。実行は Docker Compose の `wportal2_web` コンテナ内 `wportal2-app/`、テストはリポジトリルートから `./tools/phpunit`。

**前提:** すでに `feature/intern-2026` ブランチ上で作業中（設計ドキュメントコミット済み `ed74780`）。コマンドのカレントはリポジトリルート `/Users/ito-koki/Documents/dev/wportal2`、PHP/npm コマンドはコンテナ内 `wportal2-app/` で実行する。

---

## Phase 1: シフト機能の削除（最終的に1コミット）

Phase 1 の Task 1〜6 では**コミットせず**ファイルを削除・編集し、Task 7 で一括検証してから1コミットする。

### Task 1: シフト専用 PHP バックエンドファイルを削除

**Files (すべて削除):**
- `wportal2-app/app/Services/Shift/` 配下全ファイル（Domain/Infrastructure/UseCase）
- `wportal2-app/app/Http/Controllers/Pages/ShiftScheduleController.php`
- `wportal2-app/app/Http/Controllers/Api/ShiftScheduleApiController.php`
- `wportal2-app/app/Models/App/Trn/TrnShiftSchedule.php`
- `wportal2-app/app/Models/App/Trn/TrnUserShiftSetting.php`
- `wportal2-app/app/Constant/ShiftScheduleConstant.php`
- `wportal2-app/app/Exceptions/ShiftEntryValidationException.php`
- `wportal2-app/app/Http/Requests/ShiftStoreRequest.php`
- `wportal2-app/app/Enum/App/ECalendarSyncStatus.php`
- `wportal2-app/app/Console/Commands/Shift/SyncShiftCalendar.php`
- `wportal2-app/app/Console/Commands/Test/RegisterShift.php`

- [ ] **Step 1: ファイル削除**

```bash
cd /Users/ito-koki/Documents/dev/wportal2
git rm -r wportal2-app/app/Services/Shift
git rm wportal2-app/app/Http/Controllers/Pages/ShiftScheduleController.php \
       wportal2-app/app/Http/Controllers/Api/ShiftScheduleApiController.php \
       wportal2-app/app/Models/App/Trn/TrnShiftSchedule.php \
       wportal2-app/app/Models/App/Trn/TrnUserShiftSetting.php \
       wportal2-app/app/Constant/ShiftScheduleConstant.php \
       wportal2-app/app/Exceptions/ShiftEntryValidationException.php \
       wportal2-app/app/Http/Requests/ShiftStoreRequest.php \
       wportal2-app/app/Enum/App/ECalendarSyncStatus.php \
       wportal2-app/app/Console/Commands/Shift/SyncShiftCalendar.php \
       wportal2-app/app/Console/Commands/Test/RegisterShift.php
```

- [ ] **Step 2: 削除漏れ・残参照の確認**

Run:
```bash
cd /Users/ito-koki/Documents/dev/wportal2/wportal2-app
grep -rlE 'ShiftScheduleController|TrnShiftSchedule|TrnUserShiftSetting|ShiftScheduleConstant|ShiftEntryValidationException|ShiftStoreRequest|ECalendarSyncStatus|Services\\\\Shift|Services/Shift' app/ routes/ config/ database/ | grep -v 'Services/Shift/'
```
Expected: 残るのは Task 6 で編集する共有ファイル（`app/Providers/AppServiceProvider.php`, `routes/web.php`, `routes/api.php`, `app/Enum/App/EPages.php`）のみ。それ以外がヒットしたら削除対象に追加する。

> 注: `app/Services/External/GoogleCalendarService.php` は汎用外部サービスのため**削除しない**（シフト専用ではない）。

---

### Task 2: シフトの DB マイグレーション・Factory を削除

**Files (削除):**
- `wportal2-app/database/migrations/2026_03_02_000001_create_trn_shift_schedule_table.php`
- `wportal2-app/database/migrations/2026_03_03_000001_create_trn_user_shift_settings_table.php`
- `wportal2-app/database/factories/TrnUserShiftEntryFactory.php`

- [ ] **Step 1: ファイル削除**

```bash
cd /Users/ito-koki/Documents/dev/wportal2
git rm wportal2-app/database/migrations/2026_03_02_000001_create_trn_shift_schedule_table.php \
       wportal2-app/database/migrations/2026_03_03_000001_create_trn_user_shift_settings_table.php \
       wportal2-app/database/factories/TrnUserShiftEntryFactory.php
```

- [ ] **Step 2: seeder からの参照確認**

Run:
```bash
cd /Users/ito-koki/Documents/dev/wportal2/wportal2-app
grep -rniE 'shift' database/seeders/
```
Expected: ヒットなし。あれば該当行を削除する。

---

### Task 3: GAS連携トークン管理を削除（Sanctum トークン利用の撤去）

**Files (削除):**
- `wportal2-app/app/Http/Controllers/Admin/ApiTokenManagementController.php`
- `wportal2-app/resources/script/Pages/Admin/ApiTokenManagement.tsx`
- `wportal2-app/resources/script/Pages/Admin/ApiTokenManagement/Index.tsx`
- `wportal2-app/resources/script/Pages/Admin/ApiTokenShow.tsx`
- `wportal2-app/resources/script/Pages/Admin/ApiTokenShow/Index.tsx`
- `wportal2-app/database/migrations/2026_05_18_000001_create_personal_access_tokens_table.php`
- `wportal2-app/database/migrations/2026_06_05_000001_add_expires_at_to_personal_access_tokens_table.php`
- `wportal2-app/tests/Feature/Admin/ApiTokenManagementControllerTest.php`

**Files (修正):**
- `wportal2-app/app/Models/App/Auth/AuthUser.php:15,23`

- [ ] **Step 1: ファイル削除**

```bash
cd /Users/ito-koki/Documents/dev/wportal2
git rm wportal2-app/app/Http/Controllers/Admin/ApiTokenManagementController.php \
       wportal2-app/resources/script/Pages/Admin/ApiTokenManagement.tsx \
       wportal2-app/resources/script/Pages/Admin/ApiTokenManagement/Index.tsx \
       wportal2-app/resources/script/Pages/Admin/ApiTokenShow.tsx \
       wportal2-app/resources/script/Pages/Admin/ApiTokenShow/Index.tsx \
       wportal2-app/database/migrations/2026_05_18_000001_create_personal_access_tokens_table.php \
       wportal2-app/database/migrations/2026_06_05_000001_add_expires_at_to_personal_access_tokens_table.php \
       wportal2-app/tests/Feature/Admin/ApiTokenManagementControllerTest.php
```

- [ ] **Step 2: AuthUser から HasApiTokens を除去**

`wportal2-app/app/Models/App/Auth/AuthUser.php` の use 文（15行目）を削除:

```php
use Laravel\Sanctum\HasApiTokens;
```
↓（行ごと削除）

trait 利用（23行目）を変更:

```php
    use EagerLoadHelper, HasApiTokens, HasFactory, Notifiable;
```
↓
```php
    use EagerLoadHelper, HasFactory, Notifiable;
```

- [ ] **Step 3: 残参照の確認**

Run:
```bash
cd /Users/ito-koki/Documents/dev/wportal2/wportal2-app
grep -rliE 'HasApiTokens|createToken|ApiTokenManagement|personal_access_token|ability:shift' app/ routes/ tests/ resources/
```
Expected: 残るのは Task 6 で編集する `routes/web.php`（admin/api-tokens ルート）のみ。`config/sanctum.php` `config/cors.php` はスケルトン由来のため残置（ヒットしない想定だが、ヒットしても編集不要）。

---

### Task 4: React のシフトページを削除

**Files (削除):**
- `wportal2-app/resources/script/Pages/ShiftSchedule/` 配下全ファイル

- [ ] **Step 1: ファイル削除**

```bash
cd /Users/ito-koki/Documents/dev/wportal2
git rm -r wportal2-app/resources/script/Pages/ShiftSchedule
```

- [ ] **Step 2: 残参照の確認**

Run:
```bash
cd /Users/ito-koki/Documents/dev/wportal2/wportal2-app
grep -rlE 'Pages/ShiftSchedule|ShiftSchedule' resources/script/ | grep -vE 'Enum/(EMenu|Server/App/EPages)'
```
Expected: ヒットなし（`EMenu.ts`/`EPages.ts` は Task 6 で処理）。

---

### Task 5: シフトのテスト・ドキュメント・API ドキュメントを削除

**Files (削除):**
- `wportal2-app/tests/Feature/Services/Shift/` 配下全ファイル
- `wportal2-app/tests/Feature/Api/ShiftScheduleApiControllerTest.php`
- `wportal2-app/tests/Unit/Services/Shift/` 配下全ファイル
- `wportal2-app/tests/Unit/Collections/ShiftEntriesTest.php`
- `wportal2-app/tests/Unit/ValueObjects/ShiftEntryTest.php`
- `wportal2-app/tests/Fakes/Shift/` 配下全ファイル
- `document/features/SHIFT_SCHEDULE.md`
- `document/features/SHIFT_SCHEDULE_API.md`
- `document/features/SHIFT_SCHEDULE_API_OPERATIONS.md`
- `wportal2-app/public/api-docs/shift-schedule.html`
- `wportal2-app/public/api-docs/shift-schedule.openapi.yaml`

- [ ] **Step 1: ファイル削除**

```bash
cd /Users/ito-koki/Documents/dev/wportal2
git rm -r wportal2-app/tests/Feature/Services/Shift \
          wportal2-app/tests/Unit/Services/Shift \
          wportal2-app/tests/Fakes/Shift
git rm wportal2-app/tests/Feature/Api/ShiftScheduleApiControllerTest.php \
       wportal2-app/tests/Unit/Collections/ShiftEntriesTest.php \
       wportal2-app/tests/Unit/ValueObjects/ShiftEntryTest.php \
       document/features/SHIFT_SCHEDULE.md \
       document/features/SHIFT_SCHEDULE_API.md \
       document/features/SHIFT_SCHEDULE_API_OPERATIONS.md \
       wportal2-app/public/api-docs/shift-schedule.html \
       wportal2-app/public/api-docs/shift-schedule.openapi.yaml
```

- [ ] **Step 2: 空ディレクトリ・README リンクの確認**

Run:
```bash
cd /Users/ito-koki/Documents/dev/wportal2
ls wportal2-app/tests/Unit/Collections wportal2-app/tests/Unit/ValueObjects 2>/dev/null
grep -rniE 'SHIFT_SCHEDULE|shift-schedule' document/ README.md wportal2-app/README.md 2>/dev/null
```
Expected: テストディレクトリは他テストが無ければ空。`document/`/README にシフトへのリンクが残ればその行を削除する。

---

### Task 6: 共有ファイルからシフト参照を除去

**Files (修正):**
- `wportal2-app/routes/web.php`
- `wportal2-app/routes/api.php`
- `wportal2-app/app/Providers/AppServiceProvider.php`
- `wportal2-app/app/Enum/App/EPages.php`
- `wportal2-app/resources/script/Enum/Server/App/EPages.ts`（PHP enum 再生成 + 手書き箇所の手動修正）
- `wportal2-app/resources/script/Enum/EMenu.ts`
- `wportal2-app/resources/script/Component/Drawer/DrawerItem.tsx`

- [ ] **Step 1: `routes/web.php` のシフトルートと admin/api-tokens ルートを削除**

シフト管理ブロック（コメント含む）を削除:
```php
    /**
     * シフト管理.
     */
    Route::prefix('/shift_schedule')->group(function () {
        Route::match(['get'], '/', EPages::SHIFT_SCHEDULE->getInvokePath());
        Route::post('/store', EPages::SHIFT_SCHEDULE__STORE->getInvokePath());
        Route::get('/export', EPages::SHIFT_SCHEDULE__EXPORT->getInvokePath());
    });

```

admin/api-tokens ブロック（コメント含む）を削除:
```php
    /**
     * 管理画面: API トークン管理
     */
    Route::prefix('/admin')->group(function () {
        Route::prefix('/api-tokens')->group(function () {
            Route::get('/', '\App\Http\Controllers\Admin\ApiTokenManagementController@index')
                ->name('admin.api-tokens.index');
            Route::post('/issue', '\App\Http\Controllers\Admin\ApiTokenManagementController@issue')
                ->name('admin.api-tokens.issue');
            Route::get('/show', '\App\Http\Controllers\Admin\ApiTokenManagementController@show')
                ->name('admin.api-tokens.show');
            Route::post('/{tokenId}/destroy', '\App\Http\Controllers\Admin\ApiTokenManagementController@destroy')
                ->name('admin.api-tokens.destroy')
                ->where('tokenId', '[0-9]+');
            Route::post('/rotate', '\App\Http\Controllers\Admin\ApiTokenManagementController@rotate')
                ->name('admin.api-tokens.rotate');
        });
    });
```

- [ ] **Step 2: `routes/api.php` のシフトルートと use を削除**

5行目の use を削除:
```php
use App\Http\Controllers\Api\ShiftScheduleApiController;
```

シフト API ブロック（docコメント含む）を削除（`/healthcheck` `/deployed` `/user` は残す）:
```php
/**
 * シフト管理 API
 *
 * 認証: Sanctum パーソナルアクセストークン（Authorization: Bearer <token>）
 * 認可: shift_schedule:read
 * 用途: GAS など外部クライアントからのシフト取得
 * 詳細: document/features/SHIFT_SCHEDULE_API.md を参照
 */
Route::middleware(['auth:sanctum', 'ability:shift_schedule:read'])->prefix('shift_schedule')->group(function () {
    Route::get('/export', [ShiftScheduleApiController::class, 'export']);
});
```

- [ ] **Step 3: `AppServiceProvider.php` の Shift バインドを削除**

use 文 9-12 行目を削除:
```php
use App\Services\Shift\Domain\ShiftScheduleRepositoryInterface;
use App\Services\Shift\Domain\ShiftSettingsRepositoryInterface;
use App\Services\Shift\Infrastructure\ShiftScheduleRepository;
use App\Services\Shift\Infrastructure\ShiftSettingsRepository;
```

`register()` 内のバインド 24-25 行目を削除:
```php
        $this->app->bind(ShiftScheduleRepositoryInterface::class, ShiftScheduleRepository::class);
        $this->app->bind(ShiftSettingsRepositoryInterface::class, ShiftSettingsRepository::class);
```
（`GoogleCalendarServiceInterface` のバインドは残す）

- [ ] **Step 4: `app/Enum/App/EPages.php` の SHIFT_SCHEDULE を削除**

case 定義 35-37 行目を削除:
```php
    case SHIFT_SCHEDULE                    = 'shift_schedule'; // シフト予定表.
    case SHIFT_SCHEDULE__STORE             = 'shift_schedule__store'; // シフト予定表 保存.
    case SHIFT_SCHEDULE__EXPORT            = 'shift_schedule__export'; // シフト予定表 CSV出力.
```

`getInvokePath()` の match 内 110-112 行目を削除:
```php
            self::SHIFT_SCHEDULE                 => '\App\Http\Controllers\Pages\ShiftScheduleController@index',
            self::SHIFT_SCHEDULE__STORE          => '\App\Http\Controllers\Pages\ShiftScheduleController@store',
            self::SHIFT_SCHEDULE__EXPORT         => '\App\Http\Controllers\Pages\ShiftScheduleController@export',
```

- [ ] **Step 5: TypeScript Enum を再生成**

Run（コンテナ内）:
```bash
docker exec -i wportal2_web bash -lc 'cd wportal2-app && php artisan tool:MakeTypescriptEnum'
```
Expected: `resources/script/Enum/Server/App/EPages.ts` の `#ENUM_DEFINE_START#` ブロックから `SHIFT_SCHEDULE` 系の const 3行が消える。

- [ ] **Step 6: `EPages.ts` の手書き箇所（getHref / getTitle）を手動削除**

再生成では消えない手書き分岐を削除する。`getHref()` 内（再生成前の127-132付近）:
```ts
    case E_PAGES.SHIFT_SCHEDULE:
      return '/shift_schedule';
    case E_PAGES.SHIFT_SCHEDULE__STORE:
      return '/shift_schedule/store';
    case E_PAGES.SHIFT_SCHEDULE__EXPORT:
      return '/shift_schedule/export';
```

`getTitle()` 内（再生成前の262-263付近）:
```ts
    case E_PAGES.SHIFT_SCHEDULE:
      return 'シフト管理';
```

- [ ] **Step 7: `EMenu.ts` のシフトメニューを削除**

`E_MENU` 定義（14行目）を削除:
```ts
  SHIFT_SCHEDULE: 'shift_schedule', // シフト管理.
```

MenuList の該当エントリを削除:
```ts
  {
    menu: E_MENU.SHIFT_SCHEDULE,
    pages: E_PAGES.SHIFT_SCHEDULE,
    parent: E_MENU.INVALID,
    back: E_PAGES.INVALID,
    name: 'シフト表',
    icon: E_ICON.CALENDAR_MONTH,
  },
```

- [ ] **Step 8: `DrawerItem.tsx` のシフト分岐を削除**

91行目の `Closable` を、SHIFT_SCHEDULE を参照しない形に修正する。まず該当ブロックを確認:
```bash
cd /Users/ito-koki/Documents/dev/wportal2/wportal2-app
sed -n '80,100p' resources/script/Component/Drawer/DrawerItem.tsx
```
`menu.menu === E_MENU.SHIFT_SCHEDULE` を含む `<Closable open={...}>` がシフト専用の開閉制御であれば、その条件を削除（他メニューと共有の汎用ロジックなら `E_MENU.SHIFT_SCHEDULE` の項のみ除去）。`E_MENU.SHIFT_SCHEDULE` への参照が残らないことを確認:
```bash
grep -n 'SHIFT_SCHEDULE' resources/script/Component/Drawer/DrawerItem.tsx
```
Expected: ヒットなし。

---

### Task 7: Phase 1 全体検証 + シフト削除を1コミット

- [ ] **Step 1: シフト残参照ゼロを確認**

Run:
```bash
cd /Users/ito-koki/Documents/dev/wportal2/wportal2-app
grep -rinE 'shift|シフト' app/ routes/ resources/script/ database/ config/ graphql/ | grep -viE 'shuffle|shift\(\)|array_shift|\.shift\(\)|Carbon'
```
Expected: ヒットなし（`array_shift`/`Array.shift()`/`ShuffleLunch` などの無関係語のみ除外して確認）。残れば該当を処理。

- [ ] **Step 2: PHP 静的解析・フォーマット**

Run（コンテナ内）:
```bash
docker exec -i wportal2_web bash -lc 'cd wportal2-app && ./vendor/bin/pint && ./vendor/bin/phpstan analyse -c phpstan.neon'
```
Expected: pint で差分整形のみ、phpstan は No errors（level 8）。

- [ ] **Step 3: ide-helper / lighthouse helper 再生成**

Run（コンテナ内）:
```bash
docker exec -i wportal2_web bash -lc 'cd wportal2-app && php artisan ide-helper:generate && php artisan ide-helper:models -N && php artisan lighthouse:ide-helper'
```
Expected: 生成物が更新される（削除モデル分が消える）。

- [ ] **Step 4: フロント 型チェック・Lint・ビルド**

Run（コンテナ内）:
```bash
docker exec -i wportal2_web bash -lc 'cd wportal2-app && npm run tsc && npm run eslint && npm run build'
```
Expected: tsc エラーなし、eslint エラーなし、build 成功。

- [ ] **Step 5: テストスイート実行**

Run（リポジトリルート）:
```bash
cd /Users/ito-koki/Documents/dev/wportal2
./tools/phpunit -c wportal2-app/phpunit.xml --testsuite Unit
./tools/phpunit -c wportal2-app/phpunit.xml --testsuite Feature
```
Expected: 両スイートとも緑。`RefreshDatabase` でテスト用 DB が削除済みマイグレーション無しで再構築される。

- [ ] **Step 6: コミット**

```bash
cd /Users/ito-koki/Documents/dev/wportal2
git add -A
git commit -m "$(cat <<'EOF'
chore: シフト関連機能を削除しベースライン化

シフト予定表・カレンダー同期・月次CSV/GAS連携API・トークン管理を一括削除。
React19化やテーマ等の非シフト成果は維持。

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: ライブラリ低リスク最新化（1ライブラリ群=1コミット）

各 Task は「更新 → 検証ゲート → コミット」。検証ゲート＝`npm run tsc && npm run eslint && npm run build`（フロント）または `pint && phpstan && php artisan test`（PHP）。**いずれかが落ちたらそのライブラリは元バージョンへ戻し、`log` 相当のメモを残して次へ進む**（低リスク方針）。

> npm コマンドはサンドボックス制約でキャッシュを `$TMPDIR` に向ける必要がある場合は `export npm_config_cache="$TMPDIR/npmcache"` を前置きする。コンテナ内実行時は不要。

### Task 8: React パッチ更新（19.0 → 19.2 系、lock 更新のみ）

**Files:** `wportal2-app/package.json`（変更なし、`package-lock.json` のみ更新）

- [ ] **Step 1: 更新**

```bash
docker exec -i wportal2_web bash -lc 'cd wportal2-app && npm update react react-dom @types/react @types/react-dom'
```

- [ ] **Step 2: 検証ゲート**

```bash
docker exec -i wportal2_web bash -lc 'cd wportal2-app && npm run tsc && npm run eslint && npm run build'
```
Expected: 全て成功。

- [ ] **Step 3: コミット**

```bash
cd /Users/ito-koki/Documents/dev/wportal2
git add wportal2-app/package.json wportal2-app/package-lock.json
git commit -m "chore(deps): react/react-dom を 19.2 系へ更新

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 9: TypeScript 5.9 → 6.0

**Files:** `wportal2-app/package.json:typescript`

- [ ] **Step 1: 更新**

```bash
docker exec -i wportal2_web bash -lc 'cd wportal2-app && npm install -D typescript@^6'
```

- [ ] **Step 2: 検証ゲート**

```bash
docker exec -i wportal2_web bash -lc 'cd wportal2-app && npm run tsc && npm run eslint && npm run build'
```
Expected: 成功。型エラーが出た場合は内容を確認し、軽微なら修正、破壊的なら `typescript@^5.9` に戻して見送り。

- [ ] **Step 3: コミット**

```bash
cd /Users/ito-koki/Documents/dev/wportal2
git add wportal2-app/package.json wportal2-app/package-lock.json
git commit -m "chore(deps): typescript を 6.0 へ更新

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 10: Vite 8 + 関連プラグイン（@vitejs/plugin-react 6 / laravel-vite-plugin 3）

**Files:** `wportal2-app/package.json`, 必要に応じ `wportal2-app/vite.config.ts`

- [ ] **Step 1: 更新**

```bash
docker exec -i wportal2_web bash -lc 'cd wportal2-app && npm install -D vite@^8 @vitejs/plugin-react@^6 laravel-vite-plugin@^3'
```

- [ ] **Step 2: vite.config の破壊的変更対応確認**

```bash
cd /Users/ito-koki/Documents/dev/wportal2/wportal2-app
cat vite.config.ts
```
Vite 8 / plugin v6 / laravel-vite-plugin v3 の breaking change（API 名変更・オプション廃止）があれば設定を追従修正。

- [ ] **Step 3: 検証ゲート（dev/SSR 含む）**

```bash
docker exec -i wportal2_web bash -lc 'cd wportal2-app && npm run tsc && npm run build && php artisan inertia:start-ssr & sleep 5; curl -sf localhost:9190 >/dev/null && echo SSR_OK'
```
Expected: build 成功、SSR_OK 表示。失敗時は各パッケージを元バージョンに戻して見送り。

- [ ] **Step 4: コミット**

```bash
cd /Users/ito-koki/Documents/dev/wportal2
git add wportal2-app/package.json wportal2-app/package-lock.json wportal2-app/vite.config.ts
git commit -m "chore(deps): vite 8 と関連プラグインを更新

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 11: ESLint 9 → 10 + typescript-eslint / @eslint/js / globals 追従

**Files:** `wportal2-app/package.json`, `wportal2-app/eslint.config.*`

- [ ] **Step 1: 更新**

```bash
docker exec -i wportal2_web bash -lc 'cd wportal2-app && npm install -D eslint@^10 typescript-eslint@latest @eslint/js@latest globals@latest eslint-plugin-react@latest'
```

- [ ] **Step 2: flat config の破壊的変更対応**

```bash
cd /Users/ito-koki/Documents/dev/wportal2/wportal2-app
ls eslint.config.* && cat eslint.config.*
```
ESLint 10 で廃止された設定があれば修正。

- [ ] **Step 3: 検証ゲート**

```bash
docker exec -i wportal2_web bash -lc 'cd wportal2-app && npm run eslint && npm run tsc'
```
Expected: 成功。落ちたら元バージョンへ戻して見送り。

- [ ] **Step 4: コミット**

```bash
cd /Users/ito-koki/Documents/dev/wportal2
git add wportal2-app/package.json wportal2-app/package-lock.json wportal2-app/eslint.config.*
git commit -m "chore(deps): eslint 10 と関連プラグインを更新

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 12: その他フロント依存のマイナー/パッチ一括更新

**Files:** `wportal2-app/package.json`

- [ ] **Step 1: 更新候補の確認**

```bash
docker exec -i wportal2_web bash -lc 'cd wportal2-app && npm outdated || true'
```
MUI（6→9）・@apollo/client（3→4）・@inertiajs/react（メジャー）は**除外**。それ以外のマイナー/パッチ（@emotion 系、graphql-codegen 系、prettier、husky、lefthook、qrcode.react、react-dropzone 等）を対象にする。

- [ ] **Step 2: 個別に更新**

```bash
docker exec -i wportal2_web bash -lc 'cd wportal2-app && npm update @emotion/react @emotion/styled @graphql-codegen/cli @graphql-codegen/introspection @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo prettier'
```

- [ ] **Step 3: 検証ゲート（codegen 含む）**

```bash
docker exec -i wportal2_web bash -lc 'cd wportal2-app && npm run gen && npm run tsc && npm run eslint && npm run build'
```
Expected: codegen 成功（`graphql.tsx` 再生成）、以降も成功。

- [ ] **Step 4: コミット**

```bash
cd /Users/ito-koki/Documents/dev/wportal2
git add wportal2-app/package.json wportal2-app/package-lock.json wportal2-app/resources/script/Graphql/codegen/graphql.tsx
git commit -m "chore(deps): フロント依存のマイナー/パッチ更新

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 13: Inertia 2 → 3（client + laravel 両側、検証ベース）

**Files:** `wportal2-app/package.json:@inertiajs/react`, `wportal2-app/composer.json:inertiajs/inertia-laravel`

- [ ] **Step 1: 互換バージョンを確認**

```bash
docker exec -i wportal2_web bash -lc 'cd wportal2-app && npm view @inertiajs/react version'
docker exec -i wportal2_web bash -lc 'cd wportal2-app && composer show -a inertiajs/inertia-laravel 2>/dev/null | head -20'
```
client v3 に対応する inertia-laravel のメジャーを把握する（両者のメジャーを揃える）。

- [ ] **Step 2: 両側を更新**

```bash
docker exec -i wportal2_web bash -lc 'cd wportal2-app && npm install @inertiajs/react@^3'
docker exec -i wportal2_web bash -lc 'cd wportal2-app && composer require inertiajs/inertia-laravel:^<v3対応版> -W'
```
（`<v3対応版>` は Step 1 の結果で確定）

- [ ] **Step 3: 破壊的変更対応 + 検証ゲート（SSR 必須）**

```bash
docker exec -i wportal2_web bash -lc 'cd wportal2-app && npm run tsc && npm run build && ./vendor/bin/phpstan analyse -c phpstan.neon && php artisan inertia:start-ssr & sleep 5; curl -sf localhost:9190 >/dev/null && echo SSR_OK'
```
Expected: build 成功・phpstan 緑・SSR_OK。Inertia v3 の API 変更（`router`/`usePage`/SSR 設定等）でコード修正が必要なら追従。**破壊的で収拾がつかない場合は client/laravel とも 2 系へ戻して見送り**（spec 通り据え置き許容）。

- [ ] **Step 4: コミット（採用できた場合のみ）**

```bash
cd /Users/ito-koki/Documents/dev/wportal2
git add wportal2-app/package.json wportal2-app/package-lock.json wportal2-app/composer.json wportal2-app/composer.lock
git commit -m "chore(deps): Inertia を v3 へ更新（client+laravel）

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 14: PHP / composer のベストエフォート最新化（コンテナ内・packagist 接続あり）

**Files:** `wportal2-app/composer.json`, `wportal2-app/composer.lock`, Docker/CI の PHP バージョン定義

> 本タスクはサンドボックス外（packagist 接続が必要）。コンテナ内で実施する。破壊的変更が大きければ 11 系据え置きを許容（spec 通り）。

- [ ] **Step 1: 現状と最新の差分確認**

```bash
docker exec -i wportal2_web bash -lc 'cd wportal2-app && composer outdated --direct'
```

- [ ] **Step 2: マイナー/パッチを先に更新**

```bash
docker exec -i wportal2_web bash -lc 'cd wportal2-app && composer update --with-all-dependencies'
```
- [ ] **Step 3: 検証ゲート**

```bash
docker exec -i wportal2_web bash -lc 'cd wportal2-app && ./vendor/bin/pint && ./vendor/bin/phpstan analyse -c phpstan.neon'
cd /Users/ito-koki/Documents/dev/wportal2 && ./tools/phpunit -c wportal2-app/phpunit.xml --testsuite Unit && ./tools/phpunit -c wportal2-app/phpunit.xml --testsuite Feature
```
Expected: pint/phpstan 緑、テスト緑。

- [ ] **Step 4: コミット（マイナー更新分）**

```bash
cd /Users/ito-koki/Documents/dev/wportal2
git add wportal2-app/composer.json wportal2-app/composer.lock
git commit -m "chore(deps): composer 依存をマイナー/パッチ更新

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

- [ ] **Step 5: Laravel 12 / PHP 8.4 へのメジャーアップを試行（任意・別コミット）**

```bash
docker exec -i wportal2_web bash -lc 'cd wportal2-app && composer require laravel/framework:^12 -W --no-update && composer update --with-all-dependencies'
```
larastan / nunomaduro/collision / phpunit / spatie/laravel-ignition など Laravel 12 互換版へ追従。Step 3 の検証ゲートを再実行し、緑なら別コミット。落ちて収拾不能なら `git checkout -- composer.json composer.lock` で 11 系据え置き。PHP 8.4 化は Docker イメージ・`composer.json` の `"php"` 制約・CI を合わせて更新できる場合のみ。

---

## Self-Review メモ（spec 対応確認済み）

- spec「シフト専用ファイル削除」→ Task 1,2,4,5 / 「トークン管理削除」→ Task 3 / 「共有ファイル修正」→ Task 6 で網羅
- spec「低リスクのみ最新化」→ Task 8〜12（MUI/Apollo は明示除外）、「Inertia は検証ベース」→ Task 13、「composer はベストエフォート」→ Task 14
- spec「削除1コミット→アップ段階コミット」→ Phase 1 末尾で1コミット、Phase 2 は Task ごとにコミット
- spec「生成物の再生成」→ Task 6(TS enum)、Task 7(ide-helper/lighthouse)、Task 12(codegen) で対応
- spec「テスト用 DB 再構築」→ Task 7 Step 5 の RefreshDatabase で吸収
