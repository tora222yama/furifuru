import * as React from 'react';
import { Box, FormControl } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { E_BUTTON_TYPE } from '@/script/Component/Button/EButtonType';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';
import { IFormInputFormValidationResult } from '@/script/Pages/InputForm/FormInputFormValidation';
import { InputMulti } from '@/script/Pages/InputForm/FormInputForm/InputMulti';
import { InputSingle } from '@/script/Pages/InputForm/FormInputForm/InputSingle';

export interface IFormInputForm {
  inputSingleNumber: string;
  inputSingleNotZero: string;
  inputSingleRange: string;
  inputMulti: string;
}

interface IProps extends IPropsBase {
  loading: boolean;
  formInputForm: IFormInputForm;
  validation: IFormInputFormValidationResult;
  handleUpdate: (newValues: Partial<IFormInputForm>) => void;
  handleSaveGraphQL: () => void;
}
export const FormInputForm: React.FC<IProps> = ({
  sx,
  loading,
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
          disabled={loading}
        />
      </Box>
    </FormControl>
  );
};
