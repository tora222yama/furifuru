import * as React from 'react';
import { router } from '@inertiajs/react';
import { Box, Paper } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { useIndexContext } from '@/script/Pages/Division/Index';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { TypoSubTitle1 } from '@/script/Component/Typography/TypoSubTitle1';
import { E_COLOR } from '@/script/Enum/EColor';
import { Paging } from '@/script/Component/Misc/Paging';
import { useProgressContext } from '@/script/Provider/ProgressProvider';

interface IProps extends IPropsBase {}
export const DivisionList: React.FC<IProps> = ({ sx }) => {
  const { trnDivisionList, trnDivisionListCount } = useIndexContext();
  const { onStart, onFinish } = useProgressContext();
  const pageStep = 5;
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
        only: ['paginationDivision'],
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
        only: ['paginationDivision'],
      });

      return nextIndex;
    });
  }, [setPageIndex, onStart, onFinish]);

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
        total={trnDivisionListCount}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
      {trnDivisionList.list().map(division => {
        return (
          <Paper
            sx={{
              padding: '20px',
              '&:not(:first-of-type)': {
                marginTop: '10px',
              },
            }}
            key={division.id}
          >
            <TypoSubTitle1>{division.name}</TypoSubTitle1>
            <Box
              sx={{
                marginTop: '5px',
                backgroundColor: E_COLOR.GREY_LIGHT,
              }}
            >
              <TypoText sx={{ whiteSpace: 'pre-wrap' }}>
                {division.explain}
              </TypoText>
            </Box>
            <TypoText sx={{ marginTop: '5px' }}>メンバー</TypoText>
          </Paper>
        );
      })}
      <Paging
        sx={{
          marginTop: '10px',
          justifyContent: 'flex-end',
        }}
        index={pageIndex}
        step={pageStep}
        total={trnDivisionListCount}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    </Box>
  );
};
