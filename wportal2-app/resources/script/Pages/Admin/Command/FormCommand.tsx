import * as React from 'react';
import { Box, FormControl } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { InputField } from '@/script/Component/Form/InputField';
import { InputFieldMultiline } from '@/script/Component/Form/InputFieldMultiline';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';

export interface IFormCommand {
  command: string;
  output: string;
}

interface IProps extends IPropsBase {
  formCommand: IFormCommand;
  handleUpdate: (newValues: Partial<IFormCommand>) => void;
  handleSubmit: () => void;
}
export const FormCommand: React.FC<IProps> = ({
  sx,
  formCommand,
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
        <TypoText sx={{ minWidth: '200px' }}>php artisan</TypoText>
        <InputField
          id="form-admin-command-command"
          inputValue={formCommand.command}
          onChange={command => handleUpdate({ command })}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <TypoText sx={{ minWidth: '200px' }}>output</TypoText>
        <InputFieldMultiline
          id="form-admin-command-output"
          sx={{
            width: '100%',
          }}
          inputProps={{
            width: '100%',
          }}
          inputValue={formCommand.output}
          disabled
          onChange={output => handleUpdate({ output })}
        />
      </Box>
      <ButtonGeneral
        sx={{
          minWidth: '200px',
        }}
        label="送信"
        onClick={handleSubmit}
      />
    </FormControl>
  );
};
