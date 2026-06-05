<?php

declare(strict_types=1);

namespace App\Constant;

final class ShiftScheduleConstant
{
    /** @deprecated descriptionへの埋め込みから extendedProperties への移行に伴い非推奨 */
    public const string MARKER                = '[SHIFT_SYNC]';

    /** extendedProperties.shared に埋め込むシフト同期識別キー */
    public const string SOURCE_EXTENDED_KEY   = 'source';

    /** extendedProperties.shared に埋め込むシフト同期識別値 */
    public const string SOURCE_EXTENDED_VALUE = 'shift_sync';
}
