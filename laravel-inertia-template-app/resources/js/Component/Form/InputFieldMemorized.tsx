import * as React from 'react';
import { Box, TextField } from '@mui/material';
import { IInputFieldProps } from '@/js/Component/Form/IInputFieldProps';
import { Closable } from '@/js/Component/Misc/Closable';
import { InputError } from '@/js/Component/Form/InputError';
import { E_COLOR } from '@/js/Enum/EColor';

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
  const [isEdited, setIsEdited] = React.useState<boolean>(false);

  /**
   * 背景色の取得.
   */
  const getBackgroundColor = (): string => {
    if (errors === undefined || !errors.length) {
      return E_COLOR.WHITE;
    }
    return !isEdited ? E_COLOR.RED_LIGHT : E_COLOR.WHITE;
  };

  /**
   * 入力値変更の検知.
   */
  const handleChange = (value: string) => {
    setIsEdited(true);
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
        sx={{
          backgroundColor: getBackgroundColor(),
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
