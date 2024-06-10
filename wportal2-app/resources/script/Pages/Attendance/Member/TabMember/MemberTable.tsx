import * as React from 'react';
import {
  Box,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
} from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { IAppTrnUser } from '@/script/Models/App/Trn/TrnUserList';
import { E_COLOR } from '@/script/Enum/EColor';
import { Avatar } from '@/script/Pages/Common/Avatar';
import { IAttendanceState } from '@/script/Pages/Attendance/IAttendanceState';
import { DialogUser } from '@/script/Pages/Attendance/DialogUser';
import { Closable } from '@/script/Component/Misc/Closable';
import { getLabelWorkingState } from '@/script/Enum/Server/App/EWorkingState';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { Icon } from '@/script/Component/Misc/Icon';
import { getIconWorkingPlace } from '@/script/Enum/Server/App/EWorkingPlace';
import {
  E_ATTENDANCE_STATE,
  getLabelAttendanceState,
} from '@/script/Enum/Server/App/EAttendanceState';
import { DateTime } from '@/script/Common/DateTime';

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
    height: '40px',
    padding: '5px 10px',
  },
}));

interface IProps extends IPropsBase {
  stateList: IAttendanceState[];
}
export const MemberTable: React.FC<IProps> = ({ sx, stateList }) => {
  const [selectedUser, setSelectedUser] = React.useState<
    IAppTrnUser | undefined
  >(undefined);

  /**
   * ユーザーが選択された場合.
   */
  const handleSelect = (trnUser?: IAppTrnUser) => {
    setSelectedUser(trnUser);
  };

  /**
   * テーブル各レコード.
   */
  const tableBody = (): React.ReactNode => {
    return stateList.map(state => (
      <TableRow
        sx={{
          backgroundColor: E_COLOR.WHITE,
          '&:hover': {
            backgroundColor: theme => theme.palette.primary.light,
            cursor: 'pointer',
          },
        }}
        key={state.trnUser.id}
      >
        <StyledTableCell>{state.trnUser.id}</StyledTableCell>
        <StyledTableCell>
          <Avatar
            trnUser={state.trnUser}
            active={state.isWorking}
            rest={state.isRest}
            handleSelect={handleSelect}
          />
        </StyledTableCell>
        <StyledTableCell>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <TypoText>{getLabelWorkingState(state.workingState)}</TypoText>
            <Icon icon={getIconWorkingPlace(state.workingPlace)} />
          </Box>
        </StyledTableCell>
        <StyledTableCell>
          <TypoText>
            {getLabelAttendanceState(
              state.lastAttendanceState.eAttendanceState,
            )}
            <Closable
              open={
                state.lastAttendanceState.eAttendanceState !==
                E_ATTENDANCE_STATE.INVALID
              }
            >
              (
              {DateTime.parseString(
                state.lastAttendanceState.updatedAt,
              ).toHHMM()}
              )
            </Closable>
          </TypoText>
        </StyledTableCell>
      </TableRow>
    ));
  };

  return (
    <Table sx={sx}>
      <Closable open={!!selectedUser}>
        <DialogUser
          trnUser={selectedUser}
          handleClose={() => setSelectedUser(undefined)}
        />
      </Closable>
      <TableHead>
        <TableRow>
          <StyledTableCell sx={{ width: '60px' }}>ID</StyledTableCell>
          <StyledTableCell sx={{ width: '200px' }}>メンバー</StyledTableCell>
          <StyledTableCell sx={{ width: '140px' }}>勤怠状態</StyledTableCell>
          <StyledTableCell>最終アクション</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>{tableBody()}</TableBody>
    </Table>
  );
};
