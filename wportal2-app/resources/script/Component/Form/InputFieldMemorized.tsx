import * as React from 'react';
import { Box, TextField } from '@mui/material';
import {
  IInputFieldProps,
  InputFieldType,
} from '@/script/Component/Form/IInputFieldProps';
import { Closable } from '@/script/Component/Misc/Closable';
import { InputError } from '@/script/Component/Form/InputError';
import { E_COLOR } from '@/script/Enum/EColor';
import { parseInputProps } from '@/script/Component/Form/IInputProps';

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
  inputProps,
}) => {
  const input = parseInputProps(inputProps);
  const [isEdited, setIsEdited] = React.useState<boolean>(false);

  /**
   * ロード時に編集フラグを落とす.
   */
  React.useEffect(() => {
    setIsEdited(false);
  }, [errors]);

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
        '& .MuiOutlinedInput-root': {
          padding: '4px',
          lineHeight: 'normal',
        },
        ...sx,
      }}
    >
      <TextField
        id={id}
        sx={{
          width: input.width,
          minWidth: input.minWidth,
          height: input.height,
          backgroundColor: getBackgroundColor(),

          '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: E_COLOR.GREY,
          },
        }}
        inputProps={{
          sx: {
            width: input.width,
            height: input.height,
            resize: input.resize,
            padding: input.padding,
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
