<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\GraphQL\App\Queries\AppRedisQuery;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Response;
use Psr\SimpleCache\InvalidArgumentException;

class RedisPostResultController extends Controller
{
    /**
     * @throws InvalidArgumentException
     */
    public function invoke(Request $request): Response
    {
        // POSTの値を取得.
        $storeValue = $request->input('store_value', '');

        // キャッシュに値を保存.
        Cache::set(AppRedisQuery::REDIS_QUERY_STORE_KEY, $storeValue, 3600);

        return $this->render('IndexProvider/RedisPostResultIndex', [
            'storeValue' => $storeValue,
        ]);
    }
}
