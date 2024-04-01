import * as React from 'react';
import { Box, TextField } from '@mui/material';
import { IInputFieldProps } from '@/js/Component/Form/IInputFieldProps';
import { Closable } from '@/js/Component/Misc/Closable';
import { InputError } from '@/js/Component/Form/InputError';

export const InputFieldMemorized: React.FC<IInputFieldProps> = ({
  sx,
  id,
  inputValue,
  onChange,
  onBlur,
  errors,
  visibleError,
  placeHolder,
  type,
  autoComplete,
  disabled,
}) => {
  /**
   * 入力値変更の検知.
   */
  const handleChange = (value: string) => {
    onChange(value);
  };

  /**
   * Blur（フォーカスアウト）の検知
   */
  const handleBlur = (value: string) => {
    if (onBlur) {
      onBlur(value);
    }
  };

  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      <TextField
        id={id}
        inputProps={{
          sx: {
            resize: 'both',
          },
        }}
        variant="outlined"
        value={inputValue}
        onChange={v => {
          handleChange(v.target.value);
        }}
        onBlur={v => {
          handleBlur(v.target.value);
        }}
        placeholder={placeHolder}
        type={type}
        autoComplete={autoComplete}
        disabled={disabled}
      />
      <Closable open={visibleError}>
        <InputError sx={{ marginLeft: '0' }} errors={errors} />
      </Closable>
    </Box>
  );
};
