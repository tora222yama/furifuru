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
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';
import { InputField } from '@/script/Component/Form/InputField';

interface IProps extends IPropsBase {}
export const UserList: React.FC<IProps> = ({ sx }) => {
  const { trnUserListCount } = useIndexContext();
  const { onStart, onFinish } = useProgressContext();
  const pageStep = 20;
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  const [searchFormValue, setSearchFormValue] = React.useState<string>('');
  const [searchValue, setSearchValue] = React.useState<string>('');

  /**
   * 検索値の更新.
   */
  const handleUpdate = React.useCallback(
    (newValue: string) => {
      setSearchFormValue(newValue);
    },
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
        searchValue: searchFormValue,
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
          searchValue,
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
          searchValue,
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <InputField
          sx={{
            width: '100%',
          }}
          inputProps={{
            width: '100%',
          }}
          id="user-search"
          inputValue={searchFormValue}
          onChange={searchFormValue => handleUpdate(searchFormValue)}
        />
        <ButtonGeneral
          sx={{
            padding: '5px 10px',
          }}
          label="検索"
          onClick={handleSubmitSearch}
          disabled={searchValue === searchFormValue}
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
