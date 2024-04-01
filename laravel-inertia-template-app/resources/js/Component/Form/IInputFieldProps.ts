import { IPropsBase } from '@/js/System/System';

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
}
