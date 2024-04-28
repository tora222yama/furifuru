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
import { IAppTrnFacility } from '@/script/Models/App/Trn/TrnFacilityList';
import { usePaginationContext } from '@/script/Pages/IndexProvider/PaginationIndex';

interface IProps extends IPropsBase {}
export const FixList: React.FC<IProps> = ({ sx }) => {
  const { fixList } = usePaginationContext();

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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width="10%">ID</TableCell>
            <TableCell width="20%">名前</TableCell>
            <TableCell>説明</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fixList.list().map(v => {
            return nodeItem(v);
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};
