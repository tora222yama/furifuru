import { SxProps, Theme } from '@mui/material';

export interface IPropsBase {
  sx?: SxProps<Theme>;
  id?: string;
  children?: React.ReactNode;
  csrfToken?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authUser?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  location?: any;
}
