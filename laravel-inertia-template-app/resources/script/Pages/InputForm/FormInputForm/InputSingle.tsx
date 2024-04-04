import * as React from 'react';
import { Box, List, ListItem, ListSubheader, Paper } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { IFormInputFormValidationResult } from '@/script/Pages/InputForm/FormInputFormValidation';
import { IFormInputForm } from '@/script/Pages/InputForm/FormInputForm';
import { TypoH3 } from '@/script/Component/Typography/TypoH3';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { InputField } from '@/script/Component/Form/InputField';

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
          inputProps={{
            width: '400px',
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
