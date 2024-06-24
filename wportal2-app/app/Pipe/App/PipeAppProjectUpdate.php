<?php

declare(strict_types=1);

namespace App\Pipe\App;

use App\Enum\App\EPipeKind;
use App\Enum\App\EValidationType;
use App\Enum\ValidationRules\ValidationPacker;
use App\GraphQL\PipeBase;
use App\Pipe\App\Input\InputNotification;
use Illuminate\Support\Collection;

final class PipeAppProjectUpdate extends PipeBase
{
    public int $trnProjectId      = 0;

    public string $name           = '';

    public string $explain        = '';

    public bool $editNotification = false;

    public Collection $notificationList;

    /**
     * constructor.
     */
    public function __construct(array $args)
    {
        $this->notificationList = collect();
        parent::__construct(EPipeKind::APP_PROJECT_UPDATE, $args);
    }

    /**
     * データ取得.
     */
    public function parse(): void
    {
        $this->trnProjectId     = $this->getArgAsInteger('trnProjectId');
        $this->name             = $this->getArgAsString('name');
        $this->explain          = $this->getArgAsString('explain');

        // チャンネル通知.
        $this->editNotification = $this->getArgAsBoolean('editNotification');
        $notificationListJson   = $this->getArgAsString('notificationListJson');
        $notificationList       = json_decode($notificationListJson);
        if ($this->editNotification && is_array($notificationList)) {
            array_map(function ($notification) {
                $new = InputNotification::create($notification);
                $this->notificationList->add($new);
            }, $notificationList);
        }
    }

    /**
     * バリデーション実行.
     */
    public function validate(): void
    {
        $packer    = new ValidationPacker();

        // 名前.
        $packer->addValidation(
            'name',
            '名前',
            $this->name,
            collect([
                EValidationType::REQUIRED->ruleSet(),
            ])
        );

        // バリデーションの実施.
        $validator = $packer->makeValidator();
        if ($validator->fails()) {
            $this->errors = $validator->errors();
        }
    }
}
