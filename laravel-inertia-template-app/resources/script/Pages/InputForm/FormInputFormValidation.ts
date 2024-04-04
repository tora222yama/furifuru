import { IFormInputForm } from '@/script/Pages/InputForm/FormInputForm';
import {
  EValidationLevel,
  parseErrorMessage,
  validateMulti,
  ValidationFunction,
  ValidationResult,
} from '@/script/Common/Validation';
import { IMutationResult } from '@/script/Hooks/IMutationResult';
import { E_VALIDATION_TYPE } from '@/script/Enum/Server/App/EValidationType';

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
    inputSingleNumber: parseErrorMessage('input_single_number', result),
    inputSingleNotZero: parseErrorMessage('input_single_not_zero', result),
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
      formInputForm.inputSingleNumber,
      'input(single:整数)',
    ),
    inputMulti: validateInputMulti(formInputForm.inputMulti, 'input(multi)'),
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

const validateInputMulti: ValidationFunction = (value, columnName) =>
  validateMulti(value, columnName, [
    {
      type: E_VALIDATION_TYPE.REQUIRED,
      level: EValidationLevel.Error,
    },
    {
      type: E_VALIDATION_TYPE.LENGTH,
      level: EValidationLevel.Error,
      maxLength: 100,
    },
  ]);
