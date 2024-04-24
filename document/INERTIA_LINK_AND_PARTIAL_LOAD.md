# InertiaLinkとPartialLoadについて

Inertiaを利用する環境で、要となるInertiaLinkとPartialLoadについて説明します

なお本機能においてはSSRかSPAかは関係ありません。
（※SSRの時にどうやって実現しているのかいまいち想像できていません）

## はじめに

Inertiaは

- ページ読み込み
- データ取得
- データ再取得

などの処理を同一のLaravel Controllerで処理します

どういう事か、かなりわかりにくいのですが

あるページを読み込む際に、「初回」か「部分指定」かでControllerの挙動が変わります。


具体的には、以下のコントローラーアクセスの場合

```
        return $this->render('IndexProvider/PaginationIndex', [
            'trnFacilityList'      => /** データ取得処理…1 */,
            'trnFacilityListCount' => /** データ取得処理…2 */,
            'fixList'              => fn () => /** データ取得処理…3 */,
            'lazyList'             => Inertia::lazy(fn () => /** データ取得処理…4 */,
        ]);
```

```trnFacilityList``` と ```trnFacilityListCount```は毎回処理されますが

```fixList```は同一ページのリロードの際は処理されず、データに変更ないものとして処理されます。

また```lazyList```に関しては、明示的指定がない場合は処理されません。

Controllerが上記の性質を持つため、例えば

- 検索ワードによって、データをフィルタして表示するコントローラーを作る
  - 初期表示はフィルタなし
  - フィルタを更新するタイミングで、Controllerを「部分指定」+フィルタパラメータで呼び出す
  - 更新したデータで、関連箇所のみ再描画する

というような挙動を実現でき、これがLaravel + Inertiaの要となります。

詳しくは```pagination```のURLで確認できる

```laravel-inertia-template-app/app/Http/Controllers/Pages/PaginationController.php```

の挙動を確認してください。

一回目のアクセス時のqueryログは下記のようになりますが

```
2024-04-24T07:17:04.623459Z       164 Prepare   select * from `trn_facility` limit 3 offset 0
2024-04-24T07:17:04.623500Z       164 Execute   select * from `trn_facility` limit 3 offset 0
2024-04-24T07:17:04.623718Z       164 Close stmt
2024-04-24T07:17:04.623959Z       164 Prepare   select count(*) as aggregate from `trn_facility`
2024-04-24T07:17:04.624013Z       164 Execute   select count(*) as aggregate from `trn_facility`
2024-04-24T07:17:04.624739Z       164 Close stmt
2024-04-24T07:17:05.626118Z       164 Prepare   select * from `trn_facility` limit 5
2024-04-24T07:17:05.626214Z       164 Execute   select * from `trn_facility` limit 5
```

「次の３件」などで呼び出されるニ回目のアクセス時のqueryログは以下となります

※fixListが呼び出されていない

```
2024-04-24T07:17:52.786402Z       165 Prepare   select * from `trn_facility` limit 3 offset 3
2024-04-24T07:17:52.786538Z       165 Execute   select * from `trn_facility` limit 3 offset 3
2024-04-24T07:17:52.786807Z       165 Close stmt
2024-04-24T07:17:52.787133Z       165 Prepare   select count(*) as aggregate from `trn_facility`
2024-04-24T07:17:52.787213Z       165 Execute   select count(*) as aggregate from `trn_facility`
```

しかしながら、画面は新しいリストで再描画され

固定リストの描画は変動がありません。

上記を実現するためには、リンク処理をInertiaLinkもしくはPartialReloadで呼び出す必要があり、下記でそれぞれ説明します

## InertiaLink

## PartialReload