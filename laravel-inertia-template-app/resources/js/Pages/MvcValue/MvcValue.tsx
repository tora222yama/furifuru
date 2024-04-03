import * as React from 'react';
import { Box, Button, Paper } from '@mui/material';
import { IPropsBase } from '@/js/System/System';
import { useFirstPageContext } from '@/js/Pages/IndexProvider/MvcValueIndex';
import { Page } from '@/js/Pages/Page';
import { TypoH1 } from '@/js/Component/Typography/TypoH1';
import { E_PAGES, getPagesName } from '@/js/Enum/Server/App/EPages';
import { Log } from '@/js/Common/Log';

interface IPros extends IPropsBase {}
export const MvcValue: React.FC<IPros> = () => {
  const { numberValue, stringValue, arrayValue } = useFirstPageContext();

  const handleClick = () => {
    Log.info('クリックされた');
  };

  return (
    <Page>
      <TypoH1>{getPagesName(E_PAGES.MVC_VALUE)}</TypoH1>
      <Paper
        sx={{
          marginTop: '20px',
          padding: '5px',
        }}
      >
        number: {numberValue}
      </Paper>
      <Paper
        sx={{
          marginTop: '10px',
          padding: '5px',
        }}
      >
        string: {stringValue}
      </Paper>
      <Paper
        sx={{
          marginTop: '10px',
          padding: '5px',
        }}
      >
        {arrayValue.map(v => {
          return <Box key={v}>{v}</Box>;
        })}
      </Paper>
      <Button
        sx={{
          marginTop: '10px',
        }}
        style={{ background: '#F00' }}
        onClick={() => handleClick()}
      >
        test
      </Button>
    </Page>
  );
};
export default MvcValue;
