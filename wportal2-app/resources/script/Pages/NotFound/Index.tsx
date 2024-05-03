import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { CommonIndexProvider } from '@/script/Provider/CommonIndexProvider';
import { NotFound } from '@/script/Pages/NotFound/NotFound';

interface IProps extends IPropsBase {}
export const Index: React.FC<IProps> = ({ ...props }) => {
  // noinspection TypeScriptValidateTypes
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <CommonIndexProvider {...props}>
      <NotFound />
    </CommonIndexProvider>
  );
};
export default Index;
