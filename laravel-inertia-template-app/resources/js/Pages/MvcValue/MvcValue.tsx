import * as React from 'react';
import { Box, Button, Paper } from '@mui/material';
import { IPropsBase } from '@/js/System/System';
import { useFirstPageContext } from '@/js/Pages/IndexProvider/MvcValueIndex';
import { Page } from '@/js/Pages/Page';
import { TypoH1 } from '@/js/Component/Typography/TypoH1';

interface IPros extends IPropsBase {}
export const MvcValue: React.FC<IPros> = () => {
  const { numberValue, stringValue, arrayValue } = useFirstPageContext();

  const handleClick = () => {
    // eslint-disable-next-line no-console
    console.log('クリックされた');
  };

  return (
    <Page>
      <TypoH1>MVC値渡しサンプル</TypoH1>
      <Paper
        sx={{
          marginTop: '20px',
          padding: '5px',
        }}
      >
        This is First Page.
      </Paper>
      <Paper
        sx={{
          marginTop: '10px',
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
