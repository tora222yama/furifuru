import * as React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { Paging } from '@/script/Component/Misc/Paging';
import { useFetchAppPagination } from '@/script/Hooks/App/Queries/useFetchAppPagination';
import { IAppTrnFacility } from '@/script/Models/App/Trn/TrnFacilityList';
import { Loading } from '@/script/Component/Misc/Loading';

interface IProps extends IPropsBase {}
export const GraphQLPaginationList: React.FC<IProps> = ({ sx }) => {
  const pageStep = 3;
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  const [loading, count, trnFacilityList, changeCursor] = useFetchAppPagination(
    {
      pagination: {
        pageIndex,
        pageStep,
      },
    },
  );

  /**
   * 前を選択.
   */
  const handlePrev = React.useCallback(() => {
    setPageIndex(prevState => {
      const nextIndex = prevState - 1;

      changeCursor({
        pageIndex: nextIndex,
        pageStep,
      });

      return nextIndex;
    });
  }, [setPageIndex, changeCursor]);

  /**
   * 次を選択.
   */
  const handleNext = React.useCallback(() => {
    setPageIndex(prevState => {
      const nextIndex = prevState + 1;

      changeCursor({
        pageIndex: nextIndex,
        pageStep,
      });

      return nextIndex;
    });
  }, [setPageIndex, changeCursor]);

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
      <Loading loading={loading}>
        <Paging
          sx={{
            justifyContent: 'flex-end',
          }}
          index={pageIndex}
          step={pageStep}
          total={count}
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
      </Loading>
    </Paper>
  );
};
