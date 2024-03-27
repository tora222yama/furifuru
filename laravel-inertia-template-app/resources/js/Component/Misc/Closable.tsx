import * as React from 'react';
import { IPropsBase } from '@/js/System/System';

interface IProps extends IPropsBase {
  open?: boolean;
}
export const Closable: React.FC<IProps> = ({ open, children }) => {
  if (!open) {
    return null;
  }
  return <>{children}</>;
};
