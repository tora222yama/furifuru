# laravel-inertia-template
Laravel + Inertia + SSR + (React/Vite) + (MUI)のサンプル

- [利用パッケージについて](document/PACKAGE.md)
- [レスポンシブ対応（mediaQuery)について](document/MEDIA_QUERY.md)

# 環境構築

## 前提

### Windows

- Docker Desktop for Windows が利用可能になっている
- clone先にWSL2+Ubuntu環境が構築済み
- hostsファイルに ```127.0.0.1 localhost```のような記載があり、localhostでアクセスが可能になっている

### Mac

- Docker Desktop for Mac が利用可能になっている
- hostsファイルに ```127.0.0.1 localhost```のような記載があり、localhostでアクセスが可能になっている

## サンプル環境のセットアップ

- ディレクトリを作成
  - 例 ```/home/user-name/dev/laravel-inertia-template```
- 上記ディレクトリをIntellij Ideaで開く
  - 以下、構築手順はIntellij Ideaの下側のTerminalタブで実施可能ですが、Windowsターミナルなどから実施してもOKです
- Gitからコード取得
  - URL: ```https://github.com/quick-wpd/laravel-inertia-template```
- dockerディレクトリ以下に```CRLF```ファイルがあるとビルドに失敗します
  - CTRL+選択した状態でCTRL+SHIFT+Aでアクションを実施→```LF - Unix and MacOS```を実施すると一括でLFに変更できます

### セットアップ手順

- インストール時の権限でファイル所有者がrootなどになっていると正常に動作しない場合があるので、その場合はchownで対応してください
- 例）```sudo chown {name}:{group} -R {target_dir}```

```
cd laravel-inertia-template-app
cp .env.local .env
cd ..
docker-compose build
docker-compose up -d

# webコンテナにログインしてcomposerとnpmのインストール
docker exec -it template_web bash
> composer install
> npm ci

※データの初期化を追加したらここに記載する

# precommitの設定（Ubuntu上など、ターミナル側のscat2_app直下で実施する）
(> exit)
npm run prepare
(husky - Git hooks installed と表示されればOK)

# ログファイルの権限を修正（Ubuntu上など、ターミナル側のlaravel-inertia-template-app直下で実施する）
sudo chmod 777 -R storage/

# webコンテナでビルドテスト
docker exec -it template_web bash
> npm run build
※念のため画面が表示されるかチェック http://localhost:9190/first_page
```

### コミット動作テスト

- テスト用ブランチを作成する
- ```laravel-inertia-template-app/resources/js/Pages/FirstPage/FirstPage.tsx```に下記のような意味のないコードを追加

```
const i = 0; // 追加箇所
```

- 下記のコマンドを実施して、error表示がされることを確認する

```
docker exec -it template_web bash
git add .
npm run lefthook
```

- 表示されるエラーの例

```
/var/www/html/laravel-inertia-template-app/resources/js/Pages/FirstPage/FirstPage.tsx
  10:9  error  'i' is assigned a value but never used  @typescript-eslint/no-unused-vars

✖ 1 problem (1 error, 0 warnings)
```

- gitコミットを実施して、コミットが できない ことを確認する

### 開発作業

- 実際に開発を行う場合は下記を実施してください

```
docker exec -it template_web bash
npm run dev
```

実行後に```localhost:9190/first_page```ページにアクセスするとHMR(Hot Module Reload)が有効な状態でページに接続します。
この状態で対象ページのTypeScriptの更新を行うとページが自動でリロードされます。


### 本番相当のSSRアクセス

- ビルドは下記で行います

```
docker exec -it template_web bash
npm run build

※2024/03時点では大量のwarningが出ますが、無視してください
```

- ビルド後に下記を実施し、SSRのhydrate待ち受けを実施します

```
php artisan inertia:start-ssr
```

- 実行後に```localhost:9190/first_page```ページにアクセスすると、サーバー側で描画した結果を受け取れます

