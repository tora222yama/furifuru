import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { CommonIndexProvider } from '@/script/Provider/CommonIndexProvider';
import { OnetimePassword } from '@/script/Pages/Login/OnetimePassword';

interface IProps extends IPropsBase {}
export const OnetimePasswordIndex: React.FC<IProps> = ({ ...props }) => {
  // noinspection TypeScriptValidateTypes
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <CommonIndexProvider {...props}>
      <OnetimePassword />
    </CommonIndexProvider>
  );
};
export default OnetimePasswordIndex;
