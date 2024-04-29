import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { IndexProvider } from '@/script/Provider/IndexProvider';
import { Login } from '@/script/Pages/Login/Login';

interface IProps extends IPropsBase {}
export const LoginIndex: React.FC<IProps> = ({ ...props }) => {
  // noinspection TypeScriptValidateTypes
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <IndexProvider {...props}>
      <Login />
    </IndexProvider>
  );
};
export default LoginIndex;
