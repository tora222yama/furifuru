<?php

declare(strict_types=1);

namespace App\Services\External;

use Google\Exception;
use Google\Service\Calendar\Event;
use Google_Client;
use Google_Service_Calendar;
use Google_Service_Directory;
use Google_Service_PeopleService;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

/**
 * Google Calendarに対する処理.
 */
class GoogleCalendarService
{
    /**
     * 指定期間の予定を取得.
     *
     * @return Collection<Event>
     *
     * @throws Exception
     */
    public function listSchedule(string $calendarId): Collection
    {
        // サービス取得.
        $service = new Google_Service_Calendar(
            $this->getClient($calendarId)
        );

        // 結果を取得.
        try {
            $results = $service
                ->events
                ->listEvents($calendarId, [
                    'timeMin'      => date('c'),
                    'timeMax'      => date('c', strtotime('+1 week')),
                    'maxResults'   => 5,
                    'singleEvents' => true,
                    'orderBy'      => 'startTime',
                ]);

            return collect($results->getItems());
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return collect();
        }
    }

    /**
     * クライアント取得.
     *
     * @throws Exception
     */
    private function getClient(string $executorCalendarId): Google_Client
    {
        // 認証パラメータ.
        $rawData            = config('services.google.calendar_sa');
        $jsonKey            = json_decode($rawData, true);

        // 利用スコープ.
        $scope              = [
            Google_Service_Calendar::CALENDAR,
            Google_Service_Directory::ADMIN_DIRECTORY_USER_READONLY,
            Google_Service_Directory::ADMIN_DIRECTORY_RESOURCE_CALENDAR_READONLY,
            Google_Service_PeopleService::USERINFO_PROFILE,
        ];

        // クライアント作成.
        $client             = new Google_Client();
        $client->setApplicationName('wportal カレンダー操作');
        $client->setScopes($scope);
        $client->setAuthConfig($jsonKey);
        $client->setConfig('subject', $executorCalendarId);

        return $client;
    }
}
