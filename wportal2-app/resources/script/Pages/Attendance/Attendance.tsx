import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { Page } from '@/script/Pages/Page';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import { E_PAGES, getPagesName } from '@/script/Enum/Server/App/EPages';
import { DateTime } from '@/script/Common/DateTime';
import { Myself } from '@/script/Pages/Attendance/Myself/Myself';
import { Action } from '@/script/Pages/Attendance/Action/Action';

interface IProps extends IPropsBase {}
export const Attendance: React.FC<IProps> = () => {
  return (
    <Page>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <TypoH1>
          {getPagesName(E_PAGES.ATTENDANCE)}({DateTime.now().toDateJP()})
        </TypoH1>
      </Box>
      <Myself
        sx={{
          marginTop: '20px',
        }}
      />
      <Action sx={{ marginTop: '20px' }} />
    </Page>
  );
};
