import { createTheme } from '@mui/material';

export const themeCommon = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#CDDC39',
      contrastText: '#333333',
    },
    secondary: {
      main: '#FFFFFF',
      contrastText: '#4d4d4d',
    },
    background: {
      default: '#EEEEEE',
    },
    text: {
      primary: '#242424',
    },
  },
  typography: {
    fontFamily: "'Noto Sans JP', sans-serif;",
    h1: {
      fontSize: '28px',
    },
    h2: {
      fontSize: '26px',
    },
    subtitle1: {
      fontSize: '24px',
    },
    subtitle2: {
      fontSize: '20px',
    },
    body1: {
      fontSize: '16px',
    },
    body2: {
      fontSize: '14px',
    },
    button: {
      fontSize: '18px',
    },
  },
  mixins: {
    toolbar: {
      height: '64px',
      padding: '0px',
    },
    drawer: {
      width: '250px',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 375,
      md: 1024,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        noWrap: true,
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        color: 'primary',
      },
    },
  },
});
