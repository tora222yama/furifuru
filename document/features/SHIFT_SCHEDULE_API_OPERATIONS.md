# シフトスケジュール API 運用ガイド

本番環境でシフトスケジュール API を GAS と連携するための運用手順書。  
技術仕様は [SHIFT_SCHEDULE_API.md](./SHIFT_SCHEDULE_API.md) を参照。

---

## 目次

1. [初回セットアップ](#1-初回セットアップ)
2. [トークン発行](#2-トークン発行)
3. [GAS への設定](#3-gas-への設定)
4. [動作確認](#4-動作確認)
5. [トークンのローテーション](#5-トークンのローテーション)
6. [トラブルシューティング](#6-トラブルシューティング)

---

## 1. 初回セットアップ

### 1-1. マイグレーション実行

デプロイ後、`personal_access_tokens` テーブルが存在しない場合はマイグレーションを実行する。

```bash
php artisan migrate --force
```

### 1-2. 管理者権限の付与

トークン管理画面にアクセスするには `ADMIN_PRIVILEGE` 権限が必要。  
対象ユーザーにまだ権限がない場合は以下を実行する。

```bash
php artisan tool:GrantUserAuthority --email=your-email@example.com --authority=ADMIN_PRIVILEGE
```

> **Note**: 対象ユーザーは事前にアプリケーションへログイン（Google OAuth）済みである必要がある。

---

## 2. トークン発行

### 2-1. 管理画面にアクセス

`ADMIN_PRIVILEGE` を持つユーザーでログインし、以下の URL にアクセスする。

```
/admin/api-tokens
```

### 2-2. トークンを発行する

1. **「新規トークンを発行」** ボタンをクリック
2. トークン表示画面に自動リダイレクトされる
3. 表示されたトークン（`1|xxxxxxxx...` 形式）を **コピーして安全な場所に保管する**

> ⚠️ **重要**: トークンはこの画面でのみ表示される。画面を閉じると二度と確認できない。  
> 紛失した場合は、既存トークンを削除してローテーションで再発行すること。

### 2-3. トークンの保管場所（推奨）

| 用途 | 推奨保管場所 |
|---|---|
| GAS への設定 | GAS スクリプトプロパティ |
| バックアップ | 1Password / KeePass などのパスワードマネージャー |
| インフラ管理 | AWS Secrets Manager |

---

## 3. GAS への設定

### 3-1. スクリプトプロパティに登録

GAS エディタを開き、「プロジェクトの設定」→「スクリプトプロパティ」で以下を追加する。

| プロパティ名 | 値 | 例 |
|---|---|---|
| `WPORTAL_BASE_URL` | アプリのベース URL | `https://app.example.com` |
| `WPORTAL_API_TOKEN` | 手順 2 で発行したトークン | `1|xxxxxxxx...` |

> **Note**: トークンは `1|xxxxxxxx...` の形式で、`|` を含む文字列全体を登録する。

### 3-2. GAS スクリプト

以下のコードを GAS エディタに貼り付けて保存する。

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

## 4. 動作確認

### 4-1. curl での疎通確認

```bash
curl -s "https://app.example.com/api/shift_schedule/export?month=$(date +%Y-%m)" \
  -H "Authorization: Bearer <トークン>" \
  -H "Accept: application/json" | jq '{month, userCount: .meta.userCount, dateCount: .meta.dateCount}'
```

期待するレスポンス例:

```json
{
  "month": "2026-06",
  "userCount": 10,
  "dateCount": 30
}
```

### 4-2. GAS での手動実行

1. GAS エディタで `importShiftData` 関数を選択
2. **「実行」** ボタンをクリック
3. スプレッドシートの「シフト」シートにデータが書き込まれることを確認
4. GAS の実行ログにエラーがないことを確認

---

## 5. トークンのローテーション

セキュリティ向上のため、定期的（目安: **年1回以上**）にトークンをローテーションする。

### 手順

1. `/admin/api-tokens` にアクセス
2. **「トークンをローテーション」** をクリック
   - 既存トークンがすべて削除され、新しいトークンが発行される
3. 新しいトークンをコピーして保管
4. GAS スクリプトプロパティの `WPORTAL_API_TOKEN` を新しいトークンで更新
5. GAS を手動実行して動作確認

> **Note**: ローテーション後、古いトークンは即座に無効になる。GAS の更新を先に準備してからローテーションを実行することを推奨。

---

## 6. トラブルシューティング

### API が 401 Unauthorized を返す

- トークンが正しくセットされているか確認する
- `Authorization: Bearer <token>` の形式になっているか確認する（`Bearer ` の後にスペースがあること）
- トークンが削除・失効していないか管理画面で確認する

### API が 403 Forbidden を返す

- トークンの ability が `shift_schedule:read` になっているか確認する
- ローテーションで再発行したトークンを使用しているか確認する

### GAS が `API エラー: 401` を出力する

- スクリプトプロパティ `WPORTAL_API_TOKEN` の値を確認する
- トークンを `1|xxxxxxxx...` の形式（`|` を含む全体）でセットしているか確認する

### トークンを紛失した

1. 管理画面でトークン一覧を確認し、対象トークンを **削除**
2. **「トークンをローテーション」** で新しいトークンを発行
3. GAS スクリプトプロパティを更新する

### 管理画面が 404 になる

ログインユーザーに `ADMIN_PRIVILEGE` 権限がない。以下を実行して付与する。

```bash
php artisan tool:GrantUserAuthority --email=your-email@example.com --authority=ADMIN_PRIVILEGE
```

---

## 関連ドキュメント

- [SHIFT_SCHEDULE_API.md](./SHIFT_SCHEDULE_API.md) — 技術仕様・エンドポイント詳細・GAS サンプルコード
- **ReDoc（インタラクティブ API 仕様）**: `/api-docs/shift-schedule.html`
- **OpenAPI YAML**: `/api-docs/shift-schedule.openapi.yaml`
