import * as React from 'react';
import { IPropsBase } from '@/js/System/System';
import { InputForm } from '@/js/Pages/InputForm/InputForm';
import { IndexProvider } from '@/js/Provider/IndexProvider';

interface IProps extends IPropsBase {}
export const InputFormIndex: React.FC<IProps> = () => {
  return (
    <IndexProvider>
      <InputForm />
    </IndexProvider>
  );
};
export default InputFormIndex;
