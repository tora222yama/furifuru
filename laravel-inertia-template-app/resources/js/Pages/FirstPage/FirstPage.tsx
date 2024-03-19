import * as React from 'react';
import { Box, Button, Paper } from '@mui/material';
import { IPropsBase } from '@/js/System/System';
import { useFirstPageContext } from '@/js/Pages/FirstPageIndex';

interface IPros extends IPropsBase {}
export const FirstPage: React.FC<IPros> = () => {
  const { numberValue, stringValue, arrayValue } = useFirstPageContext();

  // error-test2
  const i = 0;

  const handleClick = () => {
    // eslint-disable-next-line no-console
    console.log('クリックされた');
  };

  return (
    <Box
      sx={{
        padding: '20px',
      }}
    >
      <Paper
        sx={{
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
    </Box>
  );
};
export default FirstPag;
