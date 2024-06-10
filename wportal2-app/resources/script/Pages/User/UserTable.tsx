import * as React from 'react';
import {
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
} from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { useIndexContext } from '@/script/Pages/User/Index';
import { E_COLOR } from '@/script/Enum/EColor';
import { Image } from '@/script/Component/Misc/Image';
import { IAppTrnUser } from '@/script/Models/App/Trn/TrnUserList';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: '14px',
    height: '48px',
    padding: '5px 10px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '14px',
    height: '80px',
    padding: '5px 10px',
  },
}));

interface IProps extends IPropsBase {
  handleSelect: (trnUser: IAppTrnUser) => void;
}
export const UserTable: React.FC<IProps> = ({ sx, handleSelect }) => {
  const { trnUserList } = useIndexContext();

  const tableBody = (): React.ReactNode => {
    return trnUserList.list().map(trnUser => (
      <TableRow
        sx={{
          backgroundColor: E_COLOR.WHITE,
          '&:hover': {
            backgroundColor: theme => theme.palette.primary.light,
            cursor: 'pointer',
          },
        }}
        key={trnUser.id}
        onClick={() => handleSelect(trnUser)}
      >
        <StyledTableCell>{trnUser.id}</StyledTableCell>
        <StyledTableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Image
            sx={{ width: '60px', height: '60px', borderRadius: '30px' }}
            src={trnUser.faceImagePath}
          />
        </StyledTableCell>
        <StyledTableCell>{trnUser.nickname}</StyledTableCell>
      </TableRow>
    ));
  };

  return (
    <Table sx={sx}>
      <TableHead>
        <TableRow>
          <StyledTableCell sx={{ width: '60px' }}>id</StyledTableCell>
          <StyledTableCell sx={{ width: '60px' }}>icon</StyledTableCell>
          <StyledTableCell>nickname</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>{tableBody()}</TableBody>
    </Table>
  );
};
