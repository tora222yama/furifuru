import * as React from 'react';
import { router } from '@inertiajs/react';
import { Box, Paper } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { useIndexContext } from '@/script/Pages/User/Index';
import { useProgressContext } from '@/script/Provider/ProgressProvider';
import { Paging } from '@/script/Component/Misc/Paging';
import { UserTable } from '@/script/Pages/User/UserTable';
import { IAppTrnUser } from '@/script/Models/App/Trn/TrnUserList';
import { E_PAGES, getPagesHref } from '@/script/Enum/Server/App/EPages';
import {
  FormSearch,
  IFormSearch,
  initialValue,
} from '@/script/Pages/User/FormSearch';

interface IProps extends IPropsBase {}
export const UserList: React.FC<IProps> = ({ sx }) => {
  const { trnUserListCount } = useIndexContext();
  const { onStart, onFinish } = useProgressContext();
  const pageStep = 20;
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  const [searchFormValue, setSearchFormValue] =
    React.useState<IFormSearch>(initialValue);
  const [searchValue, setSearchValue] =
    React.useState<IFormSearch>(initialValue);

  /**
   * 検索値の更新.
   */
  const handleUpdate = React.useCallback(
    (newValues: Partial<IFormSearch>) => {
      setSearchFormValue({ ...searchFormValue, ...newValues });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setSearchFormValue],
  );

  /**
   * 検索の実行.
   */
  const handleSubmitSearch = () => {
    setSearchValue(searchFormValue);
    setPageIndex(0);

    router.reload({
      method: 'post',
      preserveState: true,
      replace: true,
      onStart,
      onFinish,
      data: {
        index: 0,
        step: pageStep,
        keyword: searchFormValue.keyword,
        inactiveUserFlag: searchFormValue.inactiveUserFlag,
      },
      only: ['paginationUser'],
    });
  };

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
          keyword: searchValue.keyword,
          inactiveUserFlag: searchValue.inactiveUserFlag,
        },
        only: ['paginationUser'],
      });

      return nextIndex;
    });
  }, [setPageIndex, onStart, onFinish, searchValue]);

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
          keyword: searchValue.keyword,
          inactiveUserFlag: searchValue.inactiveUserFlag,
        },
        only: ['paginationUser'],
      });

      return nextIndex;
    });
  }, [setPageIndex, onStart, onFinish, searchValue]);

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
      <Paper
        sx={{
          padding: '20px',
        }}
      >
        <FormSearch
          formSearch={searchFormValue}
          handleUpdate={handleUpdate}
          handleSubmit={handleSubmitSearch}
        />
      </Paper>
      <Paging
        sx={{
          marginTop: '20px',
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
