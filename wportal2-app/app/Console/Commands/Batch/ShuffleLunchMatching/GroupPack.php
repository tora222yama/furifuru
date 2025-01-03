<?php

declare(strict_types=1);

namespace App\Console\Commands\Batch\ShuffleLunchMatching;

use App\Enum\App\ShuffleLunch\EGroupType;
use Illuminate\Support\Collection;

class GroupPack
{
    /** @var Collection<int, Group> */
    private Collection $groupList;

    /**
     * @param  Collection<int, Group>  $groupList
     */
    public function __construct(Collection $groupList)
    {
        $this->groupList = $groupList;
    }

    /**
     * 合計人数を指定してgroupPackを作成する.
     */
    public static function createGroupPackByTotal(int $total): GroupPack
    {
        // 2人以下は成立しない.
        if ($total <= 2) {
            return new GroupPack(new Collection);
        }

        // 3人の場合は3人グループが1つ.
        if ($total === 3) {
            return new GroupPack(new Collection(
                [new Group(EGroupType::THREE)]
            ));
        }

        // 4人の場合は4人グループが1つ.
        if ($total === 4) {
            return new GroupPack(new Collection(
                [new Group(EGroupType::FOUR)]
            ));
        }

        // 5人の場合は5人グループが1つ.
        if ($total === 5) {
            return new GroupPack(new Collection(
                [new Group(EGroupType::FIVE)]
            ));
        }

        $groupList = new Collection;
        self::createGroupRecursive($groupList, $total);

        return new GroupPack($groupList);
    }

    /**
     * 渡された人数からグループリストを作成する.
     *
     * @param  Collection<int, Group>  $ret
     */
    private static function createGroupRecursive(Collection &$ret, int $total): void
    {
        // mod4が0なら商だけ4のグループが存在.
        if ($total % 4 === 0) {
            for ($i = 0; $i < $total / 4; $i++) {
                $ret->add(
                    new Group(EGroupType::FOUR)
                );
            }
        }

        // mod4が3の時は商だけ4が存在し、3が一つ.
        if ($total % 4 === 3) {
            for ($i = 0; $i < ($total - 3) / 4; $i++) {
                $ret->add(
                    new Group(EGroupType::FOUR)
                );
            }
            $ret->add(
                new Group(EGroupType::THREE)
            );
        }

        // mod4が1か2なら3のグループカウントを+1してから、3を引いて、再帰処理
        if ($total % 4 === 1 || $total % 4 === 2) {
            $ret->add(
                new Group(EGroupType::THREE)
            );
            self::createGroupRecursive($ret, $total - 3);
        }
    }

    /**
     * @return Collection<int, Group>
     */
    public function getGroupList(): Collection
    {
        return $this->groupList;
    }
}
