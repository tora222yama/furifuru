import * as React from 'react';
import { Box, List, ListItem, ListSubheader, Paper } from '@mui/material';
import { IPropsBase } from '@/js/System/System';
import { IFormInputFormValidationResult } from '@/js/Pages/InputForm/FormInputFormValidation';
import { IFormInputForm } from '@/js/Pages/InputForm/FormInputForm';
import { TypoH3 } from '@/js/Component/Typography/TypoH3';
import { TypoText } from '@/js/Component/Typography/TypoText';
import { InputFieldMultiline } from '@/js/Component/Form/InputFieldMultiline';

interface IProps extends IPropsBase {
  formInputForm: IFormInputForm;
  validation: IFormInputFormValidationResult;
  handleUpdate: (newValues: Partial<IFormInputForm>) => void;
}
export const InputMulti: React.FC<IProps> = ({
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
      <TypoH3>Input(multi)</TypoH3>
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
        </List>
        <InputFieldMultiline
          sx={{
            marginTop: '10px',
          }}
          inputProps={{
            width: '100%',
            resize: 'vertical',
          }}
          rows={5}
          inputValue={formInputForm.inputMulti}
          onChange={inputMulti => handleUpdate({ inputMulti })}
          placeHolder="入力してください"
          errors={validation.data.inputMulti?.errors}
          visibleError
        />
      </Paper>
    </Box>
  );
};
