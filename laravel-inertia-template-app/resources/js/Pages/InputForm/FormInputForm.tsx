import * as React from 'react';
import { Box, FormControl } from '@mui/material';
import { IPropsBase } from '@/js/System/System';
import { E_BUTTON_TYPE } from '@/js/Component/Button/EButtonType';
import { ButtonGeneral } from '@/js/Component/Button/ButtonGeneral';
import { IFormInputFormValidationResult } from '@/js/Pages/InputForm/FormInputFormValidation';
import { InputSingle } from '@/js/Pages/InputForm/FormInputForm/InputSingle';
import { InputMulti } from '@/js/Pages/InputForm/FormInputForm/InputMulti';

export interface IFormInputForm {
  inputSingle: string;
  inputMulti: string;
}

interface IProps extends IPropsBase {
  formInputForm: IFormInputForm;
  validation: IFormInputFormValidationResult;
  handleUpdate: (newValues: Partial<IFormInputForm>) => void;
  handleSaveGraphQL: () => void;
}
export const FormInputForm: React.FC<IProps> = ({
  sx,
  formInputForm,
  validation,
  handleUpdate,
  handleSaveGraphQL,
}) => {
  return (
    <FormControl
      sx={{
        ...sx,
      }}
    >
      <InputSingle
        sx={{
          marginTop: '20px',
        }}
        formInputForm={formInputForm}
        validation={validation}
        handleUpdate={handleUpdate}
      />
      <InputMulti
        sx={{
          marginTop: '20px',
        }}
        formInputForm={formInputForm}
        validation={validation}
        handleUpdate={handleUpdate}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <ButtonGeneral
          sx={{
            width: '200px',
            marginTop: '20px',
          }}
          buttonType={E_BUTTON_TYPE.PRIMARY}
          label="GraphQLで保存"
          onClick={handleSaveGraphQL}
        />
      </Box>
    </FormControl>
  );
};
