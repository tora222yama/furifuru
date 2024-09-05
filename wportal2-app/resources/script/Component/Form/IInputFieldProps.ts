import { IPropsBase } from '@/script/System/System';
import { IInputProps } from '@/script/Component/Form/IInputProps';

export type InputFieldType = 'text' | 'email' | 'password' | 'date' | 'number';
export interface IInputFieldProps extends IPropsBase {
  inputValue: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  visibleError?: boolean;
  errors?: string[];
  placeHolder?: string;
  type?: InputFieldType;
  autoComplete?: string;
  disabled?: boolean;
  inputProps?: IInputProps;
}
