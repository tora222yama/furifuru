import * as React from 'react';
import { Box, FormControl } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { InputField } from '@/script/Component/Form/InputField';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';

export interface IFormLegacyLogin {
  email: string;
  password: string;
}
interface IProps extends IPropsBase {
  formLegacyLogin: IFormLegacyLogin;
  handleUpdate: (newValues: Partial<IFormLegacyLogin>) => void;
  handleSubmit: () => void;
}
export const FormLegacyLogin: React.FC<IProps> = ({
  sx,
  formLegacyLogin,
  handleUpdate,
  handleSubmit,
}) => {
  return (
    <FormControl
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px',
        ...sx,
      }}
      component="form"
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TypoText sx={{ minWidth: '100px' }}>email</TypoText>
        <InputField
          sx={{
            width: '100%',
          }}
          inputProps={{
            width: '100%',
            padding: '2px',
          }}
          id="form-legacy-login-email"
          inputValue={formLegacyLogin.email}
          onChange={email => handleUpdate({ email })}
          visibleError
        />
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TypoText sx={{ minWidth: '100px' }}>password</TypoText>
        <InputField
          sx={{
            width: '100%',
          }}
          inputProps={{
            width: '100%',
            padding: '2px',
          }}
          id="form-legacy-login-password"
          type="password"
          inputValue={formLegacyLogin.password}
          onChange={password => handleUpdate({ password })}
          visibleError
        />
      </Box>
      <ButtonGeneral
        sx={{
          marginTop: '10px',
          minWidth: '200px',
          padding: '2px 5px',
        }}
        label="ワンタイムパスワードでログイン"
        onClick={handleSubmit}
        disabled={!formLegacyLogin.email || !formLegacyLogin.password}
      />
    </FormControl>
  );
};
