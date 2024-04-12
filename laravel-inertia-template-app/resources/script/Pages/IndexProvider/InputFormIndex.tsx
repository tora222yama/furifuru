import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { InputForm } from '@/script/Pages/InputForm/InputForm';
import { IndexProvider } from '@/script/Provider/IndexProvider';

interface IProps extends IPropsBase {}
export const InputFormIndex: React.FC<IProps> = ({ ...props }) => {
  // noinspection TypeScriptValidateTypes
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <IndexProvider {...props}>
      <InputForm />
    </IndexProvider>
  );
};
export default InputFormIndex;
