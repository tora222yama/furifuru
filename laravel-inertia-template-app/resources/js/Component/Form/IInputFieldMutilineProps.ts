import { IPropsBase } from '@/js/System/System';
import { IInputProps } from '@/js/Component/Form/IInputProps';

export type InputFieldMultilineType = 'text' | 'password' | 'number';
export interface IInputFieldMultilineProps extends IPropsBase {
  inputValue: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  visibleError?: boolean;
  errors?: string[];
  placeHolder?: string;
  type?: InputFieldMultilineType;
  rows?: number;
  autoComplete?: string;
  disabled?: boolean;
  inputProps?: IInputProps;
}
