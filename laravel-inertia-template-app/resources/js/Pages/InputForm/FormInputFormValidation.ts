import { IFormInputForm } from '@/js/Pages/InputForm/FormInputForm';
import {
  EValidationLevel,
  parseErrorMessage,
  validateMulti,
  ValidationFunction,
  ValidationResult,
} from '@/js/Common/Validation';
import { IMutationResult } from '@/js/Hooks/IMutationResult';
import { E_VALIDATION_TYPE } from '@/js/Enum/Server/App/EValidationType';

type IFormInputFormValidation = Partial<{
  [K in keyof IFormInputForm]: ValidationResult;
}>;

export interface IFormInputFormValidationResult {
  hasError: boolean;
  data: IFormInputFormValidation;
}
export const initialResult: IFormInputFormValidationResult = {
  hasError: false,
  data: {},
};

/**
 * サーバー側のバリデーションをparseする.
 */
export const parseServerValidation = (
  result: IMutationResult,
): IFormInputFormValidationResult => {
  if (!result.errors) {
    return initialResult;
  }
  const ret: IFormInputFormValidation = {
    inputSingle: parseErrorMessage('input_single', result),
    inputMulti: parseErrorMessage('input_multi', result),
  };
  return {
    hasError: Object.entries(ret).some(([, res]) => res && res.hasError),
    data: ret,
  };
};

/**
 * バリデーション実行.
 */
export const validateAll = (
  formInputForm: IFormInputForm,
): IFormInputFormValidationResult => {
  const results = {
    inputSingle: validateInputSingle(
      formInputForm.inputSingle,
      'input(single)',
    ),
  };
  return {
    hasError: Object.entries(results).some(
      ([, result]) => result && result.hasError,
    ),
    data: results,
  };
};

const validateInputSingle: ValidationFunction = (value, columnName) =>
  validateMulti(value, columnName, [
    {
      type: E_VALIDATION_TYPE.REQUIRED,
      level: EValidationLevel.Error,
    },
    {
      type: E_VALIDATION_TYPE.NUMBER,
      level: EValidationLevel.Error,
    },
  ]);
