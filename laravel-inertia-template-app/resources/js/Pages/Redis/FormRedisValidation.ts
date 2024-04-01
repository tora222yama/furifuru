import { IFormRedis } from '@/js/Pages/Redis/FormRedis';
import {
  EValidationLevel,
  validateMulti,
  ValidationFunction,
  ValidationResult,
} from '@/js/Common/Validation';
import { E_VALIDATION_TYPE } from '@/js/Common/EValidationType';

type IFormRedisValidation = Partial<{
  [K in keyof IFormRedis]: ValidationResult;
}>;

export interface IFormRedisValidationResult {
  hasError: boolean;
  data: IFormRedisValidation;
}
export const initialResult: IFormRedisValidationResult = {
  hasError: false,
  data: {},
};

/**
 * バリデーション実行.
 */
export const validateAll = (
  formRedis: IFormRedis,
): IFormRedisValidationResult => {
  const results = {
    storeValue: validateStoreValue(formRedis.storeValue, 'Redis保存値'),
  };
  return {
    hasError: Object.entries(results).some(
      ([, result]) => result && result.hasError,
    ),
    data: results,
  };
};

const validateStoreValue: ValidationFunction = (value, columnName) =>
  validateMulti(value, columnName, [
    {
      type: E_VALIDATION_TYPE.REQUIRED,
      level: EValidationLevel.Error,
    },
  ]);
