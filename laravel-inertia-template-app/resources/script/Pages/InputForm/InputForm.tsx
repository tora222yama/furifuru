import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { Page } from '@/script/Pages/Page';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import { E_PAGES, getPagesName } from '@/script/Enum/Server/App/EPages';
import {
  FormInputForm,
  IFormInputForm,
} from '@/script/Pages/InputForm/FormInputForm';
import {
  IFormInputFormValidationResult,
  initialResult,
  parseServerValidation,
  validateAll,
} from '@/script/Pages/InputForm/FormInputFormValidation';
import { useMutationActionAppInputFormUpdate } from '@/script/Hooks/App/Mutations/useMutationActionAppInputFormUpdate';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';

interface IProps extends IPropsBase {}
export const InputForm: React.FC<IProps> = () => {
  const [formInputForm, setFormInputForm] = React.useState<IFormInputForm>({
    inputSingleNumber: '',
    inputSingleNotZero: '',
    inputSingleRange: '',
    inputMulti: '',
  });
  const [validation, setValidation] =
    React.useState<IFormInputFormValidationResult>(initialResult);
  const [processingUpdate, mutationUpdate] =
    useMutationActionAppInputFormUpdate();
  const loading = processingUpdate;

  /**
   * 値の更新.
   */
  const handleUpdate = React.useCallback(
    (newValues: Partial<IFormInputForm>) => {
      setFormInputForm(prevState => ({ ...prevState, ...newValues }));
    },
    [setFormInputForm],
  );

  /**
   * graphqlで送信.
   */
  const handleSaveGraphQL = () => {
    // バリデーション実行.
    const validation = validateAll(formInputForm);
    setValidation(validation);

    // エラーがある場合は処理をしない.
    if (validation.hasError) {
      return;
    }

    // 更新処理の実施.
    mutationUpdate(
      {
        inputSingleNumber: formInputForm.inputSingleNumber,
        inputSingleNotZero: formInputForm.inputSingleNotZero,
        inputSingleRange: formInputForm.inputSingleRange,
        inputMulti: formInputForm.inputMulti,
      },
      [],
    ).then(res => {
      switch (res.statusCode) {
        case E_STATUS_CODE.UNPROCESSABLE_ENTITY:
          setValidation(parseServerValidation(res));
          break;
        default:
          break;
      }
    });
  };

  return (
    <Page>
      <TypoH1>{getPagesName(E_PAGES.INPUT_FORM)}</TypoH1>
      <FormInputForm
        sx={{
          width: '100%',
        }}
        loading={loading}
        formInputForm={formInputForm}
        validation={validation}
        handleUpdate={handleUpdate}
        handleSaveGraphQL={handleSaveGraphQL}
      />
    </Page>
  );
};
