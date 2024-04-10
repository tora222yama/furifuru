import * as React from 'react';
import { Box, FormControl } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { InputField } from '@/script/Component/Form/InputField';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { E_BUTTON_TYPE } from '@/script/Component/Button/EButtonType';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';

export interface IFormLoginForm {
  email: string;
  password: string;
}
interface IProps extends IPropsBase {
  loading: boolean;
  formLoginForm: IFormLoginForm;
  handleUpdate: (newValues: Partial<IFormLoginForm>) => void;
  handleSubmitLogin: () => void;
}
export const FormLoginForm: React.FC<IProps> = ({
  sx,
  loading,
  formLoginForm,
  handleUpdate,
  handleSubmitLogin,
}) => {
  return (
    <FormControl
      sx={{
        marginTop: '20px',
        ...sx,
      }}
      component="form"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TypoText
          sx={{
            width: '120px',
          }}
        >
          email
        </TypoText>
        <InputField
          inputValue={formLoginForm.email}
          onChange={email => handleUpdate({ email })}
          placeHolder="入力してください"
        />
      </Box>
      <Box
        sx={{
          marginTop: '10px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TypoText
          sx={{
            width: '120px',
          }}
        >
          password
        </TypoText>
        <InputField
          type="password"
          inputValue={formLoginForm.password}
          onChange={password => handleUpdate({ password })}
          placeHolder="入力してください"
        />
      </Box>
      <ButtonGeneral
        sx={{
          marginTop: '20px',
        }}
        buttonType={E_BUTTON_TYPE.PRIMARY}
        onClick={handleSubmitLogin}
        label="ログインを実施"
        disabled={loading}
      />
    </FormControl>
  );
};
