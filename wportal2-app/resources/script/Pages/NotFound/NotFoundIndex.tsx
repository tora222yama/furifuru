import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { IndexProvider } from '@/script/Provider/IndexProvider';
import { NotFound } from '@/script/Pages/NotFound/NotFound';

interface IProps extends IPropsBase {}
export const NotFoundIndex: React.FC<IProps> = ({ ...props }) => {
  // noinspection TypeScriptValidateTypes
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <IndexProvider {...props}>
      <NotFound />
    </IndexProvider>
  );
};
export default NotFoundIndex;
