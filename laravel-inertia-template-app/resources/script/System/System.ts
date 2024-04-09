import { SxProps, Theme } from '@mui/material';

export interface IPropsBase {
  sx?: SxProps<Theme>;
  id?: string;
  csrfToken?: string;
  children?: React.ReactNode;
}
