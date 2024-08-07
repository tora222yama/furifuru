import * as React from 'react';
import { CommonIndexProvider } from '@/script/Provider/CommonIndexProvider';
import { IPropsBase } from '@/script/System/System';
import { Intern } from '@/script/Pages/Sample/Intern/Intern';

interface IProps extends IPropsBase {}
export const Index: React.FC<IProps> = ({ ...props }) => {
  // noinspection TypeScriptValidateTypes
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <CommonIndexProvider {...props}>
      <Intern />
    </CommonIndexProvider>
  );
};
export default Index;
