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
  validateAll,
} from '@/script/Pages/InputForm/FormInputFormValidation';
import { Log } from '@/script/Common/Log';

interface IProps extends IPropsBase {}
export const InputForm: React.FC<IProps> = () => {
  const [formInputForm, setFormInputForm] = React.useState<IFormInputForm>({
    inputSingle: '',
    inputMulti: '',
  });
  const [validation, setValidation] =
    React.useState<IFormInputFormValidationResult>(initialResult);

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

    Log.info('graphqlでの保存を実行');
  };

  return (
    <Page>
      <TypoH1>{getPagesName(E_PAGES.INPUT_FORM)}</TypoH1>
      <FormInputForm
        sx={{
          width: '100%',
        }}
        formInputForm={formInputForm}
        validation={validation}
        handleUpdate={handleUpdate}
        handleSaveGraphQL={handleSaveGraphQL}
      />
    </Page>
  );
};
