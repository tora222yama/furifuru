import * as React from 'react';
import { Box, Paper } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { responsiveSpacing } from '@/script/System/Responsive';
import { TypoH2 } from '@/script/Component/Typography/TypoH2';
import { useIndexContext } from '@/script/Pages/ShuffleLunch/Index';
import { useCommonIndexContext } from '@/script/Provider/CommonIndexProvider';
import {
  E_EVENT_TIME_ZONE,
  getEventTimeZoneName,
} from '@/script/Enum/Server/App/ShuffleLunch/EEventTimeZone';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { E_COLOR } from '@/script/Enum/EColor';

interface IProps extends IPropsBase {}
export const StatusRegistered: React.FC<IProps> = () => {
  const { trnShuffleLunchEntryList } = useIndexContext();
  const { authUser } = useCommonIndexContext();

  // 登録済みのゾーン.
  const registeredZone =
    trnShuffleLunchEntryList
      .list()
      .find(v => v.trnUserId === authUser.trnUser?.id)?.eventTimeZone ??
    E_EVENT_TIME_ZONE.INVALID;

  return (
    <Paper
      sx={{
        marginTop: responsiveSpacing(4),
        padding: responsiveSpacing(4),
      }}
    >
      <TypoH2>あなたの状態</TypoH2>
      <Box
        sx={{
          marginTop: responsiveSpacing(4),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: responsiveSpacing(4),
        }}
      >
        <TypoText>参加表明済みです、マッチングをお待ちください</TypoText>
        <Box
          sx={{
            padding: responsiveSpacing(2),
            borderRadius: responsiveSpacing(2),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: E_COLOR.PRIMARY_LIGHT,
          }}
        >
          <TypoText>{getEventTimeZoneName(registeredZone)}</TypoText>
        </Box>
      </Box>
    </Paper>
  );
};
