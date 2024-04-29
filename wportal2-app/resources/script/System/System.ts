import * as React from 'react';
import { SxProps, Theme } from '@mui/material';

export interface IPropsBase {
  sx?: SxProps<Theme>;
  id?: string;
  children?: React.ReactNode;
  csrfToken?: string;
  trnUser?: [];
  location?: [];
}
