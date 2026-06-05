import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { CommonIndexProvider } from '@/script/Provider/CommonIndexProvider';
import {
  ApiTokenManagement,
  IUser,
  IToken,
} from '@/script/Pages/Admin/ApiTokenManagement';

interface IProps extends IPropsBase {
  user: IUser;
  tokens: IToken[];
}

export const Index: React.FC<IProps> = ({ user, tokens, ...props }) => {
  return (
    <CommonIndexProvider {...props}>
      <ApiTokenManagement user={user} tokens={tokens} />
    </CommonIndexProvider>
  );
};
export default Index;
