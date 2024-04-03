import { IPropsBase } from '@/js/System/System';
import { IInputProps } from '@/js/Component/Form/IInputProps';

export type InputFieldType = 'text' | 'password' | 'number';
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
