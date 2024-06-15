import * as React from 'react';
import { Box, FormControl } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { InputField } from '@/script/Component/Form/InputField';

export interface IFormCommand {
  command: string;
  output: string;
}

interface IProps extends IPropsBase {
  formCommand: IFormCommand;
  handleUpdate: (newValues: Partial<IFormCommand>) => void;
}
export const FormCommand: React.FC<IProps> = ({
  sx,
  formCommand,
  handleUpdate,
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
    </FormControl>
  );
};
