import * as React from 'react';
import { Box, Divider, Paper } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { IFormInputFormValidationResult } from '@/script/Pages/InputForm/FormInputFormValidation';
import { IFormInputForm } from '@/script/Pages/InputForm/FormInputForm';
import { TypoH3 } from '@/script/Component/Typography/TypoH3';
import { Number } from '@/script/Pages/InputForm/FormInputForm/InputSingle/Number';
import { NotZero } from '@/script/Pages/InputForm/FormInputForm/InputSingle/NotZero';

interface IProps extends IPropsBase {
  formInputForm: IFormInputForm;
  validation: IFormInputFormValidationResult;
  handleUpdate: (newValues: Partial<IFormInputForm>) => void;
}
export const InputSingle: React.FC<IProps> = ({
  sx,
  formInputForm,
  validation,
  handleUpdate,
}) => {
  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      <TypoH3>Input(single)</TypoH3>
      <Paper
        sx={{
          marginTop: '20px',
          padding: '10px',
        }}
      >
        <Number
          formInputForm={formInputForm}
          validation={validation}
          handleUpdate={handleUpdate}
        />
        <Divider
          sx={{
            margin: '20px 0px',
          }}
        />
        <NotZero
          formInputForm={formInputForm}
          validation={validation}
          handleUpdate={handleUpdate}
        />
      </Paper>
    </Box>
  );
};
