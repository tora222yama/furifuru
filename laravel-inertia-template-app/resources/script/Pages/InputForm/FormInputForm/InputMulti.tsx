import * as React from 'react';
import { Box, List, ListItem, ListSubheader, Paper } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { IFormInputFormValidationResult } from '@/script/Pages/InputForm/FormInputFormValidation';
import { IFormInputForm } from '@/script/Pages/InputForm/FormInputForm';
import { TypoH3 } from '@/script/Component/Typography/TypoH3';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { InputFieldMultiline } from '@/script/Component/Form/InputFieldMultiline';

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
          height: 'auto',
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
            height: '100%',
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
