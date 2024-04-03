import * as React from 'react';
import { Box, List, ListItem, ListSubheader, Paper } from '@mui/material';
import { IPropsBase } from '@/js/System/System';
import { IFormInputFormValidationResult } from '@/js/Pages/InputForm/FormInputFormValidation';
import { IFormInputForm } from '@/js/Pages/InputForm/FormInputForm';
import { TypoH3 } from '@/js/Component/Typography/TypoH3';
import { TypoText } from '@/js/Component/Typography/TypoText';
import { InputField } from '@/js/Component/Form/InputField';

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
        <List subheader={<ListSubheader>適用バリデーション</ListSubheader>}>
          <ListItem sx={{ paddingLeft: '40px' }} disablePadding>
            <TypoText>Required</TypoText>
          </ListItem>
          <ListItem sx={{ paddingLeft: '40px' }} disablePadding>
            <TypoText>Number</TypoText>
          </ListItem>
        </List>
        <InputField
          sx={{
            marginTop: '10px',
          }}
          inputValue={formInputForm.inputSingle}
          onChange={inputSingle => handleUpdate({ inputSingle })}
          placeHolder="入力してください"
          errors={validation.data.inputSingle?.errors}
          visibleError
        />
      </Paper>
    </Box>
  );
};
