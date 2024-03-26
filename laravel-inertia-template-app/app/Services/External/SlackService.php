<?php

declare(strict_types=1);

namespace App\Services\External;

/**
 * Slackに対する処理.
 */
class SlackService
{
    /**
     * 情報チャンネルへの通知を行う.
     */
    public function notifyNotice(?string $message, ?string $title = null, ?string $file = null, array $appendParams = []): void
    {
        $url = config('slack.NoticeUrl');
        $env = config('app.env');
        $fixedTitle = "[env]:`$env`";
        $fixedFile = '';

        // タイトル指定があれば追加.
        if (isset($title)) {
            $fixedTitle .= ' '.$title;
        }

        // ファイル指定があれば追加.
        if (isset($file)) {
            $fixedFile .= $file;
        }

        $postMessage = <<<EOF
*$fixedTitle*
[type]: `Notice`
[file]: $fixedFile
EOF;

        // メッセージ指定があればコードブロックで投入する.
        if ($message !== null) {
            $postMessage .= "\n```\n$message\n```";
        }

        $this->notify($postMessage, $url, $appendParams);
    }

    /**
     * エラーチャンネルへの通知を行う.
     */
    public function notifyError(?string $message, ?string $title = null, ?string $file = null, array $appendParams = []): void
    {
        $url = config('slack.ErrorUrl');
        $env = config('app.env');
        $fixedTitle = "[env]:`$env`";
        $fixedFile = '';

        // タイトル指定があれば追加.
        if (isset($title)) {
            $fixedTitle .= ' '.$title;
        }

        // ファイル指定があれば追加.
        if (isset($file)) {
            $fixedFile .= $file;
        }

        $postMessage = <<<EOF
*$fixedTitle*
[type]: `Notice`
[file]: $fixedFile
EOF;

        // メッセージ指定があればコードブロックで投入する.
        if ($message !== null) {
            $postMessage .= "\n```\n$message\n```";
        }

        // prd環境のみ[通知タグ]を設定.
        if (isPrd()) {
            $postMessage = "<!here>\n".$postMessage;
        }

        $this->notify($postMessage, $url, $appendParams);
    }

    /**
     * メッセージ・HooksUrlを指定して通知を行う.
     */
    public function notify(string $message, string $url, array $appendParams): void
    {
        if (! isset($url)) {
            return;
        }

        $params = [
            // メッセージ本文.
            'text' => $message,
        ];
        $params = array_merge($params, $appendParams);

        // 送信オプション.
        $options = [
            CURLOPT_URL => $url,
            CURLOPT_HTTPHEADER => ['Content-type: application/json'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($params),
        ];

        // curlで送信
        $curl = curl_init();
        curl_setopt_array($curl, $options);
        curl_exec($curl);
        curl_close($curl);
    }
}
