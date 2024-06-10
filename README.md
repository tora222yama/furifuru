# wportal2
Laravel + Inertia + SSR + (React/Vite) + (MUI)のサンプル

- [利用パッケージについて](document/PACKAGE.md)
- [Laravel/Inertiaの基本的な導線とページ作成ガイド](./document/PAGE_CREATION_GUIDE.md)
- [推奨するEnumの利用・自動出力について](./document/ENUM_EXPORT.md)
- [レスポンシブ対応（mediaQuery)について](document/MEDIA_QUERY.md)
- [GraphQLの利用方法について](./document/GRAPHQL.md)
- [バリデーション（フロント/サーバー）について](./document/VALIDATION.md)
- [SPAビルドについて](./document/SPA.md)
- [InertiaLinkとPartialLoadについて](./document/INERTIA_LINK_AND_PARTIAL_LOAD.md)
- [TIPS](./document/TIPS.md)

# 環境構築

## 前提

### Windows

- Docker Desktop for Windows が利用可能になっている
- clone先にWSL2+Ubuntu環境が構築済み
  - 参考）[Ubuntu22.04のセットアップ](./document/WSL2.md)
- hostsファイルに ```127.0.0.1 localhost```のような記載があり、localhostでアクセスが可能になっている

### Mac

- Docker Desktop for Mac が利用可能になっている
- hostsファイルに ```127.0.0.1 localhost```のような記載があり、localhostでアクセスが可能になっている

## サンプル環境のセットアップ

- ディレクトリを作成
  - 例 ```/home/user-name/dev/wportal2```
- 上記ディレクトリをIntellij Ideaで開く
  - 以下、構築手順はIntellij Ideaの下側のTerminalタブで実施可能ですが、Windowsターミナルなどから実施してもOKです
- Gitからコード取得
  - URL: ```https://github.com/quick-wpd/wportal2```
- dockerディレクトリ以下に```CRLF```ファイルがあるとビルドに失敗します
  - CTRL+選択した状態でCTRL+SHIFT+Aでアクションを実施→```LF - Unix and MacOS```を実施すると一括でLFに変更できます

### コピー環境の作成

※サンプル環境での起動確認、追加、編集を行う場合は本ステップは不要
※ダウンロードしたディレクトリで「セットアップ手順」以降の対応を実施してください

新規プロジェクトなど、新しい環境を作成する場合は下記の手順を参考にしてください

- 新規リポジトリを作成
  - 例はgit名称を```new_project.git```とし、プロジェクト名を```newp```とします
  - 作成時のルールは[Backlog](https://scat919.backlog.jp/alias/wiki/1276308)を参考にしてください
- ダウンロード済みのテンプレート環境から、新規リポジトリにmirror-pushする
  - 新規で作成したリポジトリにtemplate環境のhistory含めてすべてpushされる

```
※テンプレート環境のディレクトリで実施
$ git push --mirror https://github.com/quick-wpd/new_project.git
```

- アプリケーション名を変更
  - 事故に気を付けつつCTRL+SHIFT+Rの一括置換でも問題ありません
  - そのままでも利用は可能ですが、諸々利用PJにあわせた最適化を推奨します
  - ディレクトリ名の修正
    - ```wportal2-app``` -> ```newp-app```
  - ファイル内の宣言の修正
    - ```wportal2-app``` -> ```newp-app```
    - ```wportal2``` -> ```newp```
    - ```wportal2_``` -> ```newp_```
      - 主にdocker-composeの宣言が修正されます

### セットアップ手順

- インストール時の権限でファイル所有者がrootなどになっていると正常に動作しない場合があるので、その場合はchownで対応してください
- 例）```sudo chown {name}:{group} -R {target_dir}```

```
cd wportal2-app
cp .env.local .env
cd ..
docker-compose build
docker-compose up -d

# webコンテナにログインしてcomposerとnpmのインストール
docker exec -it wportal2_web bash
> composer install
> npm ci

# webコンテナでデータベース初期化
> php artisan migrate
> (php artisan migrate:refresh // 再初期化する場合)

# precommitの設定（Ubuntu上など、ターミナル側のwportal2-app直下で実施する）
(> exit)
npm run prepare
(husky - Git hooks installed と表示されればOK)

# ログファイルの権限を修正（Ubuntu上など、ターミナル側のwportal2-app直下で実施する）
sudo chmod 777 -R storage/

# webコンテナでビルドテスト
docker exec -it wportal2_web bash
> npm run build
※念のため画面が表示されるかチェック http://localhost:9190/first_page
```

### minio(ローカル向けS3)の設定

※コンテナ追加したら追記する

### 初期データ投入

seederを利用してテストデータを投入する

```
docker exec -it wportal2_web bash
> php artisan db:seed --class=TestCaseSeeder
```

### コミット動作テスト

- テスト用ブランチを作成する
- ```wportal2-app/resources/script/Pages/MvcValue/MvcValue.tsx```に下記のような意味のないコードを追加

```
const i = 0; // 追加箇所
```

- 下記のコマンドを実施して、error表示がされることを確認する

```
docker exec -it wportal2_web bash
git add .
npm run lefthook
```

- 表示されるエラーの例

```
/var/www/html/wportal2-app/resources/script/Pages/MvcValue/MvcValue.tsx
  10:9  error  'i' is assigned a value but never used  @typescript-eslint/no-unused-vars

✖ 1 problem (1 error, 0 warnings)
```

- gitコミットを実施して、コミットが できない ことを確認する

### 開発作業

- 実際に開発を行う場合は下記を実施してください

```
docker exec -it wportal2_web bash
npm run dev
```

実行後に```localhost:9190/first_page```ページにアクセスするとHMR(Hot Module Reload)が有効な状態でページに接続します。
この状態で対象ページのTypeScriptの更新を行うとページが自動でリロードされます。


### 本番相当のSSRアクセス

- ビルドは下記で行います

```
docker exec -it wportal2_web bash
npm run build

※2024/03時点では大量のwarningが出ますが、無視してください
```

- ビルド後に下記を実施し、SSRのhydrate待ち受けを実施します

```
php artisan inertia:start-ssr
```

- 実行後に```localhost:9190```ページにアクセスすると、サーバー側で描画した結果を受け取れます

