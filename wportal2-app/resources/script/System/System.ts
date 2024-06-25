import * as React from 'react';
import { SxProps, Theme } from '@mui/material';
import { IAppTrnUser } from '@/script/Models/App/Trn/TrnUserList';
import { ILocation } from '@/script/Provider/ILocation';
import { IAppAuthUser } from '@/script/Models/App/Auth/AuthUserList';
import { IAppTrnUserAuthority } from '@/script/Models/App/Trn/TrnUserAuthorityList';

export interface IPropsBase {
  sx?: SxProps<Theme>;
  id?: string;
  children?: React.ReactNode;
  csrfToken?: string;
  authUser?: IAppAuthUser;
  trnUser?: IAppTrnUser;
  location?: ILocation;
  trnUserAuthorityList?: IAppTrnUserAuthority[];
}
