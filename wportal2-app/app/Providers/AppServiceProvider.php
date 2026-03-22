<?php

declare(strict_types=1);

namespace App\Providers;

use App\Services\External\GoogleCalendarService;
use App\Services\External\GoogleCalendarServiceInterface;
use App\Services\Shift\ShiftScheduleRepository;
use App\Services\Shift\ShiftScheduleRepositoryInterface;
use App\Services\Shift\ShiftSettingsRepository;
use App\Services\Shift\ShiftSettingsRepositoryInterface;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(GoogleCalendarServiceInterface::class, GoogleCalendarService::class);
        $this->app->bind(ShiftScheduleRepositoryInterface::class, ShiftScheduleRepository::class);
        $this->app->bind(ShiftSettingsRepositoryInterface::class, ShiftSettingsRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
        if (isPrd()) {
            URL::forceScheme('https');
        }
    }
}
