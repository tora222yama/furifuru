import * as React from 'react';
import { Dialog, Paper } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';

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
  const [dialogState, setDialogState] = React.useState<E_DIALOG_STATE>(
    E_DIALOG_STATE.SETTING_PASSWORD,
  );

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
            <ButtonGeneral
              label="送信する"
              onClick={() => setDialogState(E_DIALOG_STATE.SETTING_QR)}
            />
          </>
        );
      case E_DIALOG_STATE.SETTING_QR:
        return (
          <>
            <TypoText>- サーバーからQRを受け取る</TypoText>
            <TypoText>- Authenticatorに登録して、コードを送る</TypoText>
            <ButtonGeneral label="キャンセル" onClick={handleClose} />
            <ButtonGeneral
              label="送信する"
              onClick={() => setDialogState(E_DIALOG_STATE.SETTING_COMPLETE)}
            />
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
