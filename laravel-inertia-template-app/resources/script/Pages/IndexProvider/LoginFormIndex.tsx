import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { IndexProvider } from '@/script/Provider/IndexProvider';
import { LoginForm } from '@/script/Pages/LoginForm/LoginForm';

interface IProps extends IPropsBase {}
export const LoginFormIndex: React.FC<IProps> = ({ csrfToken, authUser }) => {
  return (
    <IndexProvider csrfToken={csrfToken} authUser={authUser}>
      <LoginForm />
    </IndexProvider>
  );
};
export default LoginFormIndex;
