<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Enum\App\EPages;
use App\Facades\Internal\PipeService;
use App\Http\Controllers\Controller;
use App\Pipe\App\PipeAppAdminCommandUpdate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Inertia\Response;
use Symfony\Component\Console\Output\BufferedOutput;

class AdminController extends Controller
{
    public function show(): Response
    {
        Log::info('ここを通過');

        return $this->render('Admin/Command/Index', []);
    }

    /**
     * コマンド実行.
     */
    public function update(Request $request): RedirectResponse
    {
        // パイプ作成.
        /** @var PipeAppAdminCommandUpdate $pipe */
        $pipe = PipeService::insertNewPipe(
            new PipeAppAdminCommandUpdate($request->toArray())
        );

        // TODO: バリデーションチェック.

        // コマンドの実行.
        /*
        $outputBuffer = new BufferedOutput();
        Artisan::call($pipe->command);
        $output = $outputBuffer->fetch();
        */

        return redirect()->action(EPages::ADMIN__COMMAND->getInvokePath());
    }
}
