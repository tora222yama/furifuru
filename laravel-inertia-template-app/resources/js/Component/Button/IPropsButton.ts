import { ButtonProps } from '@mui/material';
import { IPropsBase } from '@/js/System/System';

// ButtonPropsから利用するキー.
type UseButtonPropsKeys =
  | 'disabled'
  | 'startIcon'
  | 'endIcon'
  | 'onClick'
  | 'href';

export interface IPropsButton
  extends IPropsBase,
    Pick<ButtonProps, UseButtonPropsKeys> {
  id?: string;
  label?: string;
}
