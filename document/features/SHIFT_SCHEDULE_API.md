# シフトスケジュール API

GAS（Google Apps Script）などの外部クライアントから、全ユーザーの月次シフトを JSON 形式で取得するための API。

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

- `Content-Type: application/json`
- `month`: 対象月 (`YYYY-MM`)
- `dates`: `YYYY-MM-DD` 配列（月の全日付）
- `users`: ユーザーごとのシフト情報
- `meta`: 件数情報

#### レスポンス例

```json
{
  "month": "2026-05",
  "generatedAt": "2026-05-18T12:34:56+09:00",
  "dates": [
    "2026-05-01",
    "2026-05-02",
    "..."
  ],
  "users": [
    {
      "name": "山田 太郎",
      "email": "yamada@example.com",
      "shifts": {
        "2026-05-01": {
          "shift": "出社"
        },
        "2026-05-02": {
          "shift": "在宅"
        }
      }
    }
  ],
  "meta": {
    "userCount": 1,
    "dateCount": 31
  }
}
```

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

必要な ability: `shift_schedule:read`

### トークンの仕組み

トークンはログイン中の **admin ユーザー自身** に紐づいて発行される。  
**GAS（呼び出し側）はトークン文字列だけ知っていれば動く。** 「どのユーザーに紐づくか」はLaravelが内部で解決するため、呼び出し側が意識する必要はない。

```
発行: 管理画面にログインした admin ユーザー → createToken() → トークン文字列を生成
保存: personal_access_tokens テーブルにユーザーとの紐づきを記録

呼出: GAS が Authorization: Bearer <token> を送信
       ↓
      Laravel が personal_access_tokens テーブルを検索してユーザーを特定・認証
```

---

## トークン管理（管理画面）

`ADMIN_PRIVILEGE` 権限を持つユーザーが、管理画面から自分のアカウントにトークンを発行・管理する。

### アクセス

```
/admin/api-tokens
```

（`ADMIN_PRIVILEGE` を持つユーザーでログインが必要）

### 管理画面の機能

| 機能 | 説明 |
|---|---|
| トークン一覧表示 | 発行済みトークンの一覧（名前、作成日、最終使用日時、有効期限） |
| 新規トークン発行 | GAS 連携用 `shift_schedule:read` トークンを発行。初回のみプレーンテキストで表示 |
| トークン削除 | トークンを失効させる |
| トークンローテーション | 既存トークンすべて削除 → 新規発行（セキュリティ向上） |

### 操作フロー

1. **`/admin/api-tokens`** にアクセス
   - ログイン中のユーザー情報と発行済みトークンが表示される

2. **「新規トークンを発行」** をクリック
   - 新しいトークンが生成される
   - 自動的にトークン表示ページ（**初回のみ**）にリダイレクト

3. **プレーンテキストトークンをコピー** して保管
   - 「コピー」ボタンでクリップボードにコピー可能
   - 推奨保管場所:
     - KeePass / 1Password などのパスワードマネージャー
     - GAS プロジェクトのスクリプトプロパティ
     - AWS Secrets Manager などのシークレット管理サービス

4. **「戻る」** で管理画面に戻る

### ローテーション手順

セキュリティ向上のため、定期的（目安: 年1回以上）にトークンをローテーション：

1. **管理画面** で「トークンをローテーション」をクリック
   - 既存トークンすべて削除 → 新規発行
2. **新しいトークンをコピー** して GAS スクリプトプロパティ等を更新
3. 古いトークン参照先を確認して削除

---

## 権限付与コマンド

管理画面にアクセスするには `ADMIN_PRIVILEGE` 権限が必要。  
既存ユーザーに権限を付与するための Artisan コマンドを用意している。

### 対話モード

```bash
php artisan tool:GrantUserAuthority
```

メールアドレスの部分一致検索 → ユーザー選択 → 権限選択の順で対話的に操作できる。

### 非対話モード

```bash
php artisan tool:GrantUserAuthority --email=user@example.com --authority=ADMIN_PRIVILEGE
```

| オプション | 説明 |
|---|---|
| `--email` | 対象ユーザーのメールアドレス |
| `--authority` | `ADMIN_PRIVILEGE` / `ADMIN_COMMAND` / `ROOT_PRIVILEGE` |

- 既に同じ権限を持っている場合はスキップされる（冪等）
- トークン等の秘密情報は出力しないため、GitHub Actions ログに漏れるリスクなし

---

## 初回運用立ち上げ手順（本番導入）

以下は「最初に本番で動かす」ときの推奨手順。

### 1. DB マイグレーション実行

最新マイグレーションを適用し、`personal_access_tokens` テーブルを作成する。

```bash
docker compose exec wportal2_web php artisan migrate --force
```

### 2. 管理者権限の付与

トークン管理画面にアクセスするため、対象ユーザーに `ADMIN_PRIVILEGE` を付与する。

```bash
docker compose exec wportal2_web php artisan tool:GrantUserAuthority \
  --email=admin@example.com \
  --authority=ADMIN_PRIVILEGE
```

### 3. トークン発行（管理画面で実行）

ブラウザで管理画面にアクセスして、トークンを発行する。

1. `/admin/api-tokens` にアクセス（手順2で権限を付与したユーザーでログイン）
2. **「新規トークンを発行」** をクリック
3. 表示されたトークンを **コピーして安全な場所に保管**

**⚠️ 注意**: トークンは二度と表示されません。紛失した場合は、新しいトークンを発行してください。

### 4. API 疎通確認

```bash
curl -s "https://app.example.com/api/shift_schedule/export?month=2026-05" \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/json" | jq '.users[0]'
```

期待値: `200` / `users[].shifts[date].shift` 構造。

### 5. GAS 設定

GAS エディタの「プロジェクトの設定」>「スクリプトプロパティ」で以下を登録する。

| プロパティ名 | 値 |
|---|---|
| `WPORTAL_BASE_URL` | 例: `https://app.example.com` |
| `WPORTAL_API_TOKEN` | 手順3で発行したトークン |

### 6. 初回実行と確認

- GAS を手動実行し、対象シートにデータが書き込まれることを確認する。
- ログを確認し、エラーがないことを検証する。

### 7. 監視・運用開始

- 定期実行（トリガー）を有効化して運用開始。
- 定期的（目安: 年1回以上）にトークンをローテーション。

---

## GAS からの呼び出し方

### スクリプトプロパティにトークンを登録

GAS エディタの「プロジェクトの設定」>「スクリプト プロパティ」で以下を追加する。

| プロパティ名 | 値 |
|---|---|
| `WPORTAL_BASE_URL` | 例: `https://app.example.com` |
| `WPORTAL_API_TOKEN` | 発行したトークン文字列 |

### GAS サンプルコード

```javascript
/**
 * Web 本部ポータルからシフト JSON を取得してスプレッドシートに書き込む。
 *
 * - スクリプトプロパティ `WPORTAL_API_TOKEN` にトークンをセットしておくこと。
 * - スクリプトプロパティ `WPORTAL_BASE_URL` にベース URL をセットしておくこと。
 */
function importShiftData() {
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

  const payload = JSON.parse(response.getContentText('UTF-8'));

  const header = ['名前', 'メール', ...payload.dates];
  const rows = payload.users.map((user) => {
    const shiftColumns = payload.dates.map((date) => user.shifts[date]?.shift || '');
    return [user.name, user.email, ...shiftColumns];
  });
  const allRows = [header, ...rows];

  // アクティブなスプレッドシートの "シフト" シートに書き込む
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let sheet   = ss.getSheetByName('シフト');
  if (!sheet) {
    sheet = ss.insertSheet('シフト');
  }

  sheet.clearContents();
  sheet.getRange(1, 1, allRows.length, allRows[0].length).setValues(allRows);

  Logger.log(`シフトデータを書き込みました: ${rows.length} 件`);
}
```

---

## API 仕様ドキュメント

- ReDoc: `/api-docs/shift-schedule.html`
- OpenAPI YAML: `/api-docs/shift-schedule.openapi.yaml`

---

## 関連ファイル

| ファイル | 役割 |
|---|---|
| [app/Http/Controllers/Api/ShiftScheduleApiController.php](../wportal2-app/app/Http/Controllers/Api/ShiftScheduleApiController.php) | API コントローラー |
| [app/Http/Controllers/Admin/ApiTokenManagementController.php](../wportal2-app/app/Http/Controllers/Admin/ApiTokenManagementController.php) | トークン管理画面コントローラー |
| [app/Console/Commands/Tool/GrantUserAuthority.php](../wportal2-app/app/Console/Commands/Tool/GrantUserAuthority.php) | 権限付与コマンド |
| [routes/api.php](../wportal2-app/routes/api.php) | API ルート定義 |
| [routes/web.php](../wportal2-app/routes/web.php) | 管理画面ルート定義 |
| [bootstrap/app.php](../wportal2-app/bootstrap/app.php) | `api.php` ルートの登録 |
| [app/Models/App/Auth/AuthUser.php](../wportal2-app/app/Models/App/Auth/AuthUser.php) | `HasApiTokens` トレイト追加対象 |
| [database/migrations/2026_05_18_000001_create_personal_access_tokens_table.php](../wportal2-app/database/migrations/2026_05_18_000001_create_personal_access_tokens_table.php) | PAT テーブル定義 |
| [app/Services/Shift/UseCase/ExportMonthlyShiftUseCase.php](../wportal2-app/app/Services/Shift/UseCase/ExportMonthlyShiftUseCase.php) | シフトデータ取得ロジック（既存・変更なし） |
| [public/api-docs/shift-schedule.openapi.yaml](../wportal2-app/public/api-docs/shift-schedule.openapi.yaml) | OpenAPI 定義 |
| [public/api-docs/shift-schedule.html](../wportal2-app/public/api-docs/shift-schedule.html) | ReDoc 表示ページ |

---

## セキュリティ上の注意

- トークンはコードに直書きせず、必ず **スクリプトプロパティ** で管理する。
- このエンドポイントは全ユーザーのシフトを返す。トークン発行は `ADMIN_PRIVILEGE` 権限を持つユーザーに限定されている。
- トークンを定期的にローテーションする（目安: 年1回以上）。
- 不審なアクセスがあった場合は即座に管理画面からトークンを削除する。
