import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { CommonIndexProvider } from '@/script/Provider/CommonIndexProvider';
import { ApiTokenShow } from '@/script/Pages/Admin/ApiTokenShow';

interface IProps extends IPropsBase {
  token: string;
}

export const Index: React.FC<IProps> = ({ token, ...props }) => {
  return (
    <CommonIndexProvider {...props}>
      <ApiTokenShow token={token} />
    </CommonIndexProvider>
  );
};
export default Index;
