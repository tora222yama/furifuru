import * as React from 'react';
import { Paper } from '@mui/material';
import { IPropsBase } from '@/js/System/System';
import { Page } from '@/js/Pages/Page';
import { TypoH1 } from '@/js/Component/Typography/TypoH1';
import { E_PAGES, getPagesName } from '@/js/Enum/Server/App/EPages';
import { TypoH3 } from '@/js/Component/Typography/TypoH3';

interface IProps extends IPropsBase {}
export const InputForm: React.FC<IProps> = () => {
  return (
    <Page>
      <TypoH1>{getPagesName(E_PAGES.INPUT_FORM)}</TypoH1>
      <TypoH3 sx={{ marginTop: '20px' }}>Input(single)</TypoH3>
      <Paper
        sx={{
          marginTop: '20px',
          padding: '10px',
        }}
      >
        --
      </Paper>
      <TypoH3 sx={{ marginTop: '20px' }}>Input(multi)</TypoH3>
      <Paper
        sx={{
          marginTop: '20px',
          padding: '10px',
        }}
      >
        --
      </Paper>
    </Page>
  );
};
