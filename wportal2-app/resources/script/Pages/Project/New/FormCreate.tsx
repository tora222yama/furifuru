import * as React from 'react';
import { Box, FormControl } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { InputField } from '@/script/Component/Form/InputField';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';
import { IFormCreateValidationResult } from '@/script/Pages/Project/New/FormCreateValidation';
import { InputFieldMultiline } from '@/script/Component/Form/InputFieldMultiline';

export interface IFormCreate {
  name: string;
  explain: string;
}

interface IProps extends IPropsBase {
  formCreate: IFormCreate;
  validation: IFormCreateValidationResult;
  handleUpdate: (newValues: Partial<IFormCreate>) => void;
  handleSubmit: () => void;
}

export const FormCreate: React.FC<IProps> = ({
  sx,
  formCreate,
  validation,
  handleUpdate,
  handleSubmit,
}) => {
  return (
    <FormControl
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        gap: '20px',
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TypoText sx={{ minWidth: '200px' }}>名前</TypoText>
        <InputField
          id="form-project-create-name"
          inputValue={formCreate.name}
          onChange={name => handleUpdate({ name })}
          visibleError
          errors={validation.data.name?.errors}
        />
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TypoText sx={{ minWidth: '200px' }}>説明</TypoText>
        <InputFieldMultiline
          sx={{
            width: '100%',
          }}
          id="form-project-create-explain"
          inputValue={formCreate.explain}
          inputProps={{
            width: '100%',
            resize: 'vertical',
          }}
          onChange={explain => handleUpdate({ explain })}
          visibleError
          errors={validation.data.explain?.errors}
          rows={5}
        />
      </Box>
      <ButtonGeneral
        sx={{
          minWidth: '200px',
        }}
        label="登録"
        onClick={handleSubmit}
      />
    </FormControl>
  );
};
