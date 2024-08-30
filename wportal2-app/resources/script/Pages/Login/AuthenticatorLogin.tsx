import * as React from 'react';
import { Box, Dialog, Paper } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { E_BUTTON_TYPE } from '@/script/Component/Button/EButtonType';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';
import {
  FormAuthenticatorLogin,
  IFormAuthenticatorLogin,
} from '@/script/Pages/Login/FormAuthenticatorLogin';

interface IProps extends IPropsBase {}
export const AuthenticatorLogin: React.FC<IProps> = () => {
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [formAuthenticatorLogin, setFormAuthenticatorLogin] =
    React.useState<IFormAuthenticatorLogin>({
      email: '',
      token: '',
    });

  /**
   * 値の更新.
   */
  const handleUpdate = React.useCallback(
    (newValues: Partial<IFormAuthenticatorLogin>) => {
      setFormAuthenticatorLogin(prevState => ({ ...prevState, ...newValues }));
    },
    [setFormAuthenticatorLogin],
  );

  /**
   * 値の送信.
   */
  const handleSubmit = async () => {
    // TODO: 送信処理の実装.
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Dialog
        open={openDialog}
        PaperProps={{
          style: {
            width: '100%',
          },
        }}
        onClose={() => setOpenDialog(false)}
      >
        <Paper
          sx={{
            padding: '20px',
          }}
        >
          <FormAuthenticatorLogin
            formAuthenticatorLogin={formAuthenticatorLogin}
            handleUpdate={handleUpdate}
            handleSubmit={handleSubmit}
          />
        </Paper>
      </Dialog>
      <ButtonGeneral
        sx={{
          width: '60%',
          height: '60px',
        }}
        buttonType={E_BUTTON_TYPE.OUTLINE_PRIMARY}
        label="スマホ版ログイン"
        onClick={() => setOpenDialog(true)}
      />
    </Box>
  );
};
