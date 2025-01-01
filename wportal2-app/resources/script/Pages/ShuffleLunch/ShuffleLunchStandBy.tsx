import * as React from 'react';
import { Box, Paper } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { responsiveSpacing } from '@/script/System/Responsive';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { E_COLOR } from '@/script/Enum/EColor';

interface IProps extends IPropsBase {}
export const ShuffleLunchStandBy: React.FC<IProps> = () => {
  return (
    <>
      <Paper
        sx={{
          marginTop: responsiveSpacing(4),
          padding: responsiveSpacing(4),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              padding: responsiveSpacing(4),
              borderRadius: responsiveSpacing(4),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: E_COLOR.PRIMARY_LIGHT,
            }}
          >
            <TypoText>本日はまだマッチングが実施されていません</TypoText>
            <TypoText sx={{ marginTop: responsiveSpacing(4) }}>
              ※現在の参加者状況
            </TypoText>
          </Box>
        </Box>
      </Paper>
      <Paper
        sx={{
          marginTop: responsiveSpacing(4),
          padding: responsiveSpacing(4),
        }}
      >
        登録状態
      </Paper>
    </>
  );
};
