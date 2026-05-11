# シフトスケジュール CSV エクスポート API

GAS（Google Apps Script）などの外部クライアントから、全ユーザーの月次シフトを CSV 形式で取得するための API。

---

## エンドポイント

```
GET /api/shift_schedule/export
```

### クエリパラメータ

| パラメータ | 型 | 必須 | 説明 |
|---|---|---|---|
| `month` | string | 任意 | 対象月。`YYYY-MM` 形式（例: `2026-05`）。省略時は当月 |

### レスポンス

- `Content-Type: text/csv; charset=UTF-8`
- BOM 付き UTF-8（Excel で直接開いた際に文字化けしない）
- 1行目: ヘッダー（`名前`, `メール`, `2026-05-01`, `2026-05-02`, ...）
- 2行目以降: ユーザーごとの行（名前の五十音順）

#### シフト種別（日本語表記）

| 値 | 説明 |
|---|---|
| 出社 | オフィス出勤 |
| 在宅 | リモートワーク |
| 出張 | 社外出張 |
| 休暇 | 休暇 |
| （空文字） | 未登録 |

---

## 認証

Sanctum **パーソナルアクセストークン** を使用する。

```
Authorization: Bearer <token>
```

### トークンの仕組み

トークンは内部的に特定の `AuthUser` に紐づいて発行・管理されるが、  
**GAS（呼び出し側）はトークン文字列だけ知っていれば動く。** 「どのユーザーに紐づくか」はLaravelが内部で解決するため、呼び出し側が意識する必要はない。

```
発行: AuthUser（例: gas-service@example.com）→ createToken() → トークン文字列を生成
保存: personal_access_tokens テーブルにユーザーとの紐づきを記録

呼出: GAS が Authorization: Bearer <token> を送信
       ↓
      Laravel が personal_access_tokens テーブルを検索してユーザーを特定・認証
```

---

## 初回セットアップ（未実施の場合）

本番環境への初回反映前に以下の2点が必要。

### 1. `personal_access_tokens` テーブルのマイグレーション

Sanctum の PAT はこのテーブルで管理される。デフォルトのマイグレーションがまだ `database/migrations/` に存在しないため追加が必要。

```bash
# document/default_migrations/ にあるファイルを migrations に追加
cp document/default_migrations/2019_12_14_000001_create_personal_access_tokens_table.php \
   wportal2-app/database/migrations/

# マイグレーション実行
docker compose exec wportal2_web php artisan migrate
```

### 2. `AuthUser` モデルに `HasApiTokens` トレイトを追加

`app/Models/App/Auth/AuthUser.php` に以下を追加する。

```php
use Laravel\Sanctum\HasApiTokens;

class AuthUser extends Authenticatable
{
    use EagerLoadHelper, HasApiTokens, HasFactory, Notifiable;
    // ...
}
```

---

## トークン発行手順（管理者作業）

> **推奨**: GAS 連携専用のユーザーアカウントを1つ用意してそこに発行すると、  
> トークンの管理・失効が他ユーザーに影響しないため分かりやすい。

### 1. tinker でトークンを発行

```bash
docker compose exec wportal2_web php artisan tinker
```

```php
$user = \App\Models\App\Auth\AuthUser::where('email', 'admin@example.com')->first();
$token = $user->createToken('GAS連携')->plainTextToken;
echo $token;
```

- 表示されたトークンは**この1回しか確認できない**。必ずコピーして安全な場所に保管する。
- 以降は `personal_access_tokens` テーブルにハッシュ化されて保存される（平文は復元不可）。

### 2. 発行済みトークンの確認

```php
$user->tokens()->get(['id', 'name', 'created_at', 'last_used_at']);
```

### 3. トークンの失効（ローテーション時など）

```php
// 特定トークンを削除
$user->tokens()->where('id', <token_id>)->delete();

// 全トークンを削除
$user->tokens()->delete();
```

---

## GAS からの呼び出し方

### スクリプトプロパティにトークンを登録

GAS エディタの「プロジェクトの設定」>「スクリプト プロパティ」で以下を追加する。

| プロパティ名 | 値 |
|---|---|
| `WPORTAL_API_TOKEN` | 発行したトークン文字列 |

### GAS サンプルコード

```javascript
/**
 * Web 本部ポータルからシフト CSV を取得してスプレッドシートに書き込む。
 *
 * - スクリプトプロパティ `WPORTAL_API_TOKEN` にトークンをセットしておくこと。
 * - スクリプトプロパティ `WPORTAL_BASE_URL` にベース URL をセットしておくこと。
 *   例: https://app.wportal.com
 */
function importShiftCsv() {
  const props   = PropertiesService.getScriptProperties();
  const token   = props.getProperty('WPORTAL_API_TOKEN');
  const baseUrl = props.getProperty('WPORTAL_BASE_URL');

  if (!token || !baseUrl) {
    throw new Error('スクリプトプロパティ WPORTAL_API_TOKEN / WPORTAL_BASE_URL を設定してください');
  }

  // 対象月（省略すると当月）
  const month = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM');
  const url   = `${baseUrl}/api/shift_schedule/export?month=${month}`;

  const response = UrlFetchApp.fetch(url, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
    muteHttpExceptions: true,
  });

  if (response.getResponseCode() !== 200) {
    throw new Error(`API エラー: ${response.getResponseCode()} ${response.getContentText()}`);
  }

  // BOM を除去して CSV をパース
  const csvText = response.getContentText('UTF-8').replace(/^\uFEFF/, '');
  const rows    = Utilities.parseCsv(csvText);

  // アクティブなスプレッドシートの "シフト" シートに書き込む
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let sheet   = ss.getSheetByName('シフト');
  if (!sheet) {
    sheet = ss.insertSheet('シフト');
  }

  sheet.clearContents();
  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);

  Logger.log(`シフトデータを書き込みました: ${rows.length - 1} 件`);
}
```

---

## 関連ファイル

| ファイル | 役割 |
|---|---|
| [app/Http/Controllers/Api/ShiftScheduleApiController.php](../wportal2-app/app/Http/Controllers/Api/ShiftScheduleApiController.php) | API コントローラー |
| [routes/api.php](../wportal2-app/routes/api.php) | ルート定義 |
| [bootstrap/app.php](../wportal2-app/bootstrap/app.php) | `api.php` ルートの登録 |
| [app/Models/App/Auth/AuthUser.php](../wportal2-app/app/Models/App/Auth/AuthUser.php) | `HasApiTokens` トレイト追加対象 |
| [app/Services/Shift/UseCase/ExportMonthlyShiftUseCase.php](../wportal2-app/app/Services/Shift/UseCase/ExportMonthlyShiftUseCase.php) | CSV 生成ロジック（既存・変更なし） |
| [document/default_migrations/2019_12_14_000001_create_personal_access_tokens_table.php](default_migrations/2019_12_14_000001_create_personal_access_tokens_table.php) | PAT テーブルのマイグレーション（要コピー）|

---

## セキュリティ上の注意

- トークンはコードに直書きせず、必ず **スクリプトプロパティ** で管理する。
- このエンドポイントは**全ユーザーのシフトを返す**。発行するトークンは管理者相当のアカウントに限定することを推奨する。
- トークンを定期的にローテーションする（目安: 年1回以上）。
- 不審なアクセスがあった場合は即座にトークンを削除する。
