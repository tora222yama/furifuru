# テスト実行ガイド

## テスト種別とベースクラス
- Unitテスト: `tests/Unit` 配下。`PHPUnit\Framework\TestCase` を継承し、DBやLaravelカーネルに依存しない軽量テストを想定。
- Feature/Integrationテスト: `tests/Feature` 配下。`Tests\Feature\FeatureTestCase` を継承し、Laravelアプリを起動してHTTP層やDBを含む振る舞いを検証。`RefreshDatabase` を使い、テストごとにテーブルをリフレッシュします。

## 主要ファイル
- `phpunit.xml`: テストスイートとテスト用環境変数を定義。Featureテストで使用するDB接続は `mysql_testing` (`DB_HOST=wportal2_db_test` など) を指定。
- `tests/TestCase.php`: Laravelカーネル起動用の基底クラス。Feature系は `FeatureTestCase` 経由で利用。
- `tests/Feature/FeatureTestCase.php`: Feature/Integration 用のベースクラス。`RefreshDatabase` を適用。

## 実行コマンド
プロジェクトルート `wportal2-app` で実行してください。

```shell
# 全テスト
php artisan test

# Featureテストのみ (DBリフレッシュあり)
php artisan test --testsuite=feature

# Unitテストのみ (DB非依存前提)
php artisan test --testsuite=unit
```

## IDEから実行（IntelliJ / PhpStorm）
- **PHPUnit設定を追加**: `Settings | PHP | PHPUnit` → `+` → `By Remote Interpreter`（Docker/WSLの場合はそれを選択）または `By CLI Interpreter`（ローカルPHPの場合）。`Default configuration file` に `phpunit.xml` を指定。
- **テストフレームワーク検出**: `Test Runner` タブで `Use alternative configuration file` にチェックし `phpunit.xml` を選ぶ。
- **Run/Debug構成を作成**: `Run | Edit Configurations...` → `+` → `PHPUnit`。対象を `Defined in configuration file` にし、`Test Runner` で `phpunit.xml` を選択。Featureだけ走らせる場合は `--testsuite=feature`、Unitだけなら `--testsuite=unit` を `Test Runner options` に指定。
- **実行**: 対象構成を選んで `Run` / `Debug` をクリック。テストツリーで個別テストも右クリック実行可。
- **Dockerデバッグの注意**: `docker-compose.yml` の `wportal2_web` サービスで `XDEBUG_MODE` が `debug` に設定されているとリモートデバッグが有効化されます。IntelliJ側では `Settings | PHP | Debug` で `Debug port` を Xdebug 3 のデフォルト（9003）に合わせ、`Path mappings` を `/var/www/html/wportal2-app` ↔ ローカルプロジェクトに設定してください。

## DBと環境
- テスト環境変数は `phpunit.xml` に定義 (`APP_ENV=testing` など)。
- Featureテストは `RefreshDatabase` によりマイグレーションを実行し、テストごとにDBをクリーンにします。
- 重い場合は `DatabaseTransactions` や in-memory SQLite に切り替える運用も検討できます（`phpunit.xml` のコメントアウト例あり）。

## テスト追加の指針
- DBを触る/HTTP層を通す → `tests/Feature` に置き、`FeatureTestCase` を継承。
- 純粋なロジック検証 → `tests/Unit` に置き、`PHPUnit\Framework\TestCase` を継承。
- 共有のセットアップが必要なら専用のベースクラスやトレイトを `tests` 配下に追加し、種別に応じて使い分けてください。
