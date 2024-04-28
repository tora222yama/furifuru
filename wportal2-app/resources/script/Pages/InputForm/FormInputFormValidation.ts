import { IFormInputForm } from '@/script/Pages/InputForm/FormInputForm';
import {
  EValidationLevel,
  parseErrorMessage,
  validateMulti,
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
    inputSingleRange: parseErrorMessage('input_single_range', result),
    inputSingleEmail: parseErrorMessage('input_single_email', result),
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
    // input(single:整数).
    inputSingleNumber: validateMulti(
      formInputForm.inputSingleNumber,
      'input(single:整数)',
      [
        {
          type: E_VALIDATION_TYPE.REQUIRED,
          level: EValidationLevel.Error,
        },
        {
          type: E_VALIDATION_TYPE.NUMBER,
          level: EValidationLevel.Error,
        },
      ],
    ),

    // input(single:非0)
    inputSingleNotZero: validateMulti(
      formInputForm.inputSingleNotZero,
      'input(single:非0)',
      [
        {
          type: E_VALIDATION_TYPE.REQUIRED_NOT_ZERO,
          level: EValidationLevel.Error,
        },
      ],
    ),

    // input(single:範囲).
    inputSingleRange: validateMulti(
      formInputForm.inputSingleRange,
      'input(single:範囲)',
      [
        {
          type: E_VALIDATION_TYPE.NUMBER_RANGE,
          level: EValidationLevel.Error,
          min: 20,
          max: 50,
        },
      ],
    ),

    // input(email).
    inputSingleEmail: validateMulti(
      formInputForm.inputSingleEmail,
      'input(email)',
      [
        {
          type: E_VALIDATION_TYPE.EMAIL,
          level: EValidationLevel.Error,
        },
      ],
    ),

    // input(multi)
    inputMulti: validateMulti(formInputForm.inputMulti, 'input(multi)', [
      {
        type: E_VALIDATION_TYPE.REQUIRED,
        level: EValidationLevel.Error,
      },
      {
        type: E_VALIDATION_TYPE.LENGTH,
        level: EValidationLevel.Error,
        maxLength: 100,
      },
    ]),
  };
  return {
    hasError: Object.entries(results).some(
      ([, result]) => result && result.hasError,
    ),
    data: results,
  };
};
