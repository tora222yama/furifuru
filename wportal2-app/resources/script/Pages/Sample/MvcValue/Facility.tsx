import * as React from 'react';
import { Box, Paper } from '@mui/material';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { IPropsBase } from '@/script/System/System';
import { IAppTrnUser } from '@/script/Models/App/Trn/TrnUserList';

interface IPros extends IPropsBase {
  trnUser: IAppTrnUser;
}
export const Facility: React.FC<IPros> = ({ sx, trnUser }) => {
  return (
    <Paper
      sx={{
        padding: '20px',
        ...sx,
      }}
    >
      <TypoText>
        [{trnUser.id}]{trnUser.nickname}
      </TypoText>
      <Box
        sx={{
          border: '1px solid',
          marginTop: '10px',
          padding: '5px',
        }}
      >
        <TypoText sx={{ whiteSpace: 'pre-wrap' }}>{trnUser.nickname}</TypoText>
      </Box>
    </Paper>
  );
};
