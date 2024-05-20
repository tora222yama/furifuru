import * as React from 'react';
import { router } from '@inertiajs/react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { useIndexContext } from '@/script/Pages/User/Index';
import { useProgressContext } from '@/script/Provider/ProgressProvider';
import { Paging } from '@/script/Component/Misc/Paging';
import { UserTable } from '@/script/Pages/User/UserTable';
import { IAppTrnUser } from '@/script/Models/App/Trn/TrnUserList';
import { E_PAGES, getPagesHref } from '@/script/Enum/Server/App/EPages';

interface IProps extends IPropsBase {}
export const UserList: React.FC<IProps> = ({ sx }) => {
  const { trnUserListCount } = useIndexContext();

  const { onStart, onFinish } = useProgressContext();
  const pageStep = 20;
  const [pageIndex, setPageIndex] = React.useState<number>(0);

  /**
   * 前を選択.
   */
  const handlePrev = React.useCallback(() => {
    setPageIndex(prevState => {
      const nextIndex = prevState - 1;

      router.reload({
        method: 'post',
        preserveState: true,
        replace: true,
        onStart,
        onFinish,
        data: {
          index: nextIndex,
          step: pageStep,
        },
        only: ['paginationUser'],
      });

      return nextIndex;
    });
  }, [setPageIndex, onStart, onFinish]);

  /**
   * 次を選択.
   */
  const handleNext = React.useCallback(() => {
    setPageIndex(prevState => {
      const nextIndex = prevState + 1;

      router.reload({
        method: 'post',
        preserveState: true,
        preserveScroll: true,
        replace: true,
        onStart,
        onFinish,
        data: {
          index: nextIndex,
          step: pageStep,
        },
        only: ['paginationUser'],
      });

      return nextIndex;
    });
  }, [setPageIndex, onStart, onFinish]);

  /**
   * ユーザーを選択.
   */
  const handleSelect = (trnUser: IAppTrnUser) => {
    router.visit(
      getPagesHref(E_PAGES.USER__SHOW, [
        {
          target: '$userId',
          value: String(trnUser.id),
        },
      ]),
      {
        onStart,
        onFinish,
      },
    );
  };

  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      <Paging
        sx={{
          justifyContent: 'flex-end',
        }}
        index={pageIndex}
        step={pageStep}
        total={trnUserListCount}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
      <UserTable sx={{ marginTop: '10px' }} handleSelect={handleSelect} />
      <Paging
        sx={{
          marginTop: '10px',
          justifyContent: 'flex-end',
        }}
        index={pageIndex}
        step={pageStep}
        total={trnUserListCount}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    </Box>
  );
};
