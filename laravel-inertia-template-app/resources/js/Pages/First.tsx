import * as React from 'react';
import {Box, Button, CssBaseline, Paper, ThemeProvider} from "@mui/material";
import {themeCommon} from "@/js/ThemeCommon";

interface IPros {
  numberValue: number;
  stringValue: string;
  arrayValue: number[];
}
export const First: React.FC<IPros> = ({ numberValue, stringValue, arrayValue }) => {

  const handleClick = () => {
    console.log('クリックされた')
  }

  return (
    <ThemeProvider theme={themeCommon}>
      <CssBaseline />
      <Box sx={{
        padding: '20px',
      }}>
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
          number: { numberValue }
        </Paper>
        <Paper
          sx={{
            marginTop: '10px',
            padding: '5px',
          }}
        >
          string: { stringValue }
        </Paper>
        <Paper
          sx={{
            marginTop: '10px',
            padding: '5px',
          }}
        >
          {arrayValue.map(v => {
            return (
              <Box key={v}>
                {v}
              </Box>
            )
          })}
        </Paper>
        <Button
          sx={{
            marginTop: '10px',
          }}
          style={{background: '#F00' }}
          onClick={() => handleClick()}
        >
          test
        </Button>
      </Box>
    </ThemeProvider>
  )
}
export default First;
