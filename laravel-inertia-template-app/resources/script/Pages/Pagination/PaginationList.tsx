import * as React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { router } from '@inertiajs/react';
import { IPropsBase } from '@/script/System/System';
import { usePaginationContext } from '@/script/Pages/IndexProvider/PaginationIndex';
import { IAppTrnFacility } from '@/script/Models/App/Trn/TrnFacilityList';
import { useProgressContext } from '@/script/Provider/ProgressProvider';
import { Paging } from '@/script/Component/Misc/Paging';

interface IProps extends IPropsBase {}
export const PaginationList: React.FC<IProps> = ({ sx }) => {
  const { trnFacilityList, trnFacilityListCount } = usePaginationContext();
  const { onStart, onFinish } = useProgressContext();
  const pageStep = 3;
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
        only: ['paginationFacility'],
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
        replace: true,
        onStart,
        onFinish,
        data: {
          index: nextIndex,
          step: pageStep,
        },
        only: ['paginationFacility'],
      });

      return nextIndex;
    });
  }, [setPageIndex, onStart, onFinish]);

  /**
   * 各レコード.
   * @param trnFacility
   */
  const nodeItem = (trnFacility: IAppTrnFacility): React.ReactNode => {
    return (
      <TableRow key={trnFacility.id}>
        <TableCell>{trnFacility.id}</TableCell>
        <TableCell>{trnFacility.name}</TableCell>
        <TableCell>{trnFacility.explain}</TableCell>
      </TableRow>
    );
  };

  return (
    <Paper sx={{ padding: '10px', ...sx }}>
      <Paging
        sx={{
          justifyContent: 'flex-end',
        }}
        index={pageIndex}
        step={pageStep}
        total={trnFacilityListCount}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
      <Table
        sx={{
          marginTop: '20px',
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell width="10%">ID</TableCell>
            <TableCell width="20%">名前</TableCell>
            <TableCell>説明</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trnFacilityList.list().map(v => {
            return nodeItem(v);
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};
