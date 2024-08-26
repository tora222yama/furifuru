import * as React from 'react';
import { Box, Dialog, Paper } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import { IPropsBase } from '@/script/System/System';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';
import { useMutationAppPersonalSettingSpPassword } from '@/script/Hooks/App/Mutations/useMutationAppPersonalSettingSPPassword';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';
import { useProgressContext } from '@/script/Provider/ProgressProvider';
import { E_COLOR } from '@/script/Enum/EColor';
import { useMutationAppPersonalSettingSpConfirmCode } from '@/script/Hooks/App/Mutations/useMutationAppPersonalSettingSPConfirmCode';

/**
 * ダイアログの状態管理.
 */
export const E_DIALOG_STATE = {
  SETTING_PASSWORD: 0,
  SETTING_QR: 1,
  SETTING_COMPLETE: 2,
} as const;
export type E_DIALOG_STATE =
  (typeof E_DIALOG_STATE)[keyof typeof E_DIALOG_STATE];

interface IProps extends IPropsBase {
  open: boolean;
  handleClose: () => void;
}
export const AuthenticatorSettingDialog: React.FC<IProps> = ({
  sx,
  open,
  handleClose,
}) => {
  const { onStart, onFinish } = useProgressContext();
  const [dialogState, setDialogState] = React.useState<E_DIALOG_STATE>(
    E_DIALOG_STATE.SETTING_PASSWORD,
  );
  const [url, setUrl] = React.useState<string>('');
  const [, mutationPassword] = useMutationAppPersonalSettingSpPassword();
  const [, mutationConfirmCode] = useMutationAppPersonalSettingSpConfirmCode();

  /**
   * パスワードの送信.
   */
  const handleSubmitPassword = () => {
    onStart();
    mutationPassword({ password: 'password' }, []).then(result => {
      switch (result.statusCode) {
        case E_STATUS_CODE.OK:
          setUrl(result.url);
          setDialogState(E_DIALOG_STATE.SETTING_QR);
          break;
        default:
          break;
      }
      onFinish();
    });
  };

  /**
   * 2FAコードの送信.
   */
  const handleSubmitCode = () => {
    onStart();
    mutationConfirmCode({ code: 'code' }, []).then(result => {
      switch (result.statusCode) {
        case E_STATUS_CODE.OK:
          setDialogState(E_DIALOG_STATE.SETTING_COMPLETE);
          break;
        default:
          break;
      }
      onFinish();
    });
  };

  /**
   * 表示コンテンツ.
   */
  const nodeContent = (): React.ReactNode => {
    switch (dialogState) {
      case E_DIALOG_STATE.SETTING_PASSWORD:
        return (
          <>
            <TypoText>- サーバーにログイン用のパスワードを送信する</TypoText>
            <ButtonGeneral label="キャンセル" onClick={handleClose} />
            <ButtonGeneral label="送信する" onClick={handleSubmitPassword} />
          </>
        );
      case E_DIALOG_STATE.SETTING_QR:
        return (
          <>
            <TypoText>- サーバーからQRを受け取る</TypoText>
            <TypoText>- URL:{`${url}`}</TypoText>
            <TypoText>- Authenticatorに登録して、コードを送る</TypoText>
            <Box
              sx={{
                width: 'fit-content',
                border: `1px solid ${E_COLOR.TEXT_PRIMARY}`,
                padding: '5px 5px 0px',
              }}
            >
              <QRCodeCanvas value={url} />
            </Box>
            <ButtonGeneral label="キャンセル" onClick={handleClose} />
            <ButtonGeneral label="送信する" onClick={handleSubmitCode} />
          </>
        );
      case E_DIALOG_STATE.SETTING_COMPLETE:
        return (
          <>
            <TypoText>- 処理完了</TypoText>
            <ButtonGeneral label="閉じる" onClick={handleClose} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      sx={{
        ...sx,
      }}
      PaperProps={{
        style: {
          width: '800px',
          maxWidth: '90%',
        },
      }}
      open={open}
    >
      <Paper
        sx={{
          padding: '20px',
        }}
      >
        {nodeContent()}
      </Paper>
    </Dialog>
  );
};
