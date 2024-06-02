import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { useCommonIndexContext } from '@/script/Provider/CommonIndexProvider';
import { useIndexContext } from '@/script/Pages/Attendance/Index';
import { E_COLOR } from '@/script/Enum/EColor';
import { Icon } from '@/script/Component/Misc/Icon';
import {
  getIconWorkingPlace,
  getLabelWorkingPlace,
} from '@/script/Enum/Server/App/EWorkingPlace';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { History } from '@/script/Pages/Attendance/Myself/History';
import { AppTrnAttendanceStateList } from '@/script/Models/App/Trn/TrnAttendanceStateList';

interface IProps extends IPropsBase {}
export const MyselfRest: React.FC<IProps> = ({ sx }) => {
  const { authUser } = useCommonIndexContext();
  const { trnUserList } = useIndexContext();
  const trnUser = trnUserList.findByPrimary(authUser.trnUser?.id);
  const lastWorkingPlace = AppTrnAttendanceStateList.lastWorkingPlace(
    trnUser.trnAttendanceState,
  );

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          ...sx,
        }}
      >
        <Box
          sx={{
            width: '240px',
            height: '50px',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: E_COLOR.PRIMARY_LIGHT,
            ...sx,
          }}
        >
          <Icon
            sx={{
              marginRight: '10px',
            }}
            icon={getIconWorkingPlace(lastWorkingPlace)}
          />
          <TypoText>
            {`${getLabelWorkingPlace(lastWorkingPlace)}で休憩中`}
          </TypoText>
        </Box>
      </Box>
      <History
        sx={{
          marginTop: '20px',
        }}
      />
    </>
  );
};
