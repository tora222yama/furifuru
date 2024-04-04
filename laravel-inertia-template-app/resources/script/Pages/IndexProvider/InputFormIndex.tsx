import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { InputForm } from '@/script/Pages/InputForm/InputForm';
import { IndexProvider } from '@/script/Provider/IndexProvider';

interface IProps extends IPropsBase {}
export const InputFormIndex: React.FC<IProps> = () => {
  return (
    <IndexProvider>
      <InputForm />
    </IndexProvider>
  );
};
export default InputFormIndex;
