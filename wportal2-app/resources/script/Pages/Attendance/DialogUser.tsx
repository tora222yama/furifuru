import * as React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { IAppTrnUser } from '@/script/Models/App/Trn/TrnUserList';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';

interface IProps extends IPropsBase {
  trnUser?: IAppTrnUser;
  handleClose: () => void;
}
export const DialogUser: React.FC<IProps> = ({ sx, trnUser, handleClose }) => {
  return (
    <Dialog
      sx={{
        ...sx,
      }}
      open={!!trnUser}
      onClose={handleClose}
    >
      <DialogTitle>{`${trnUser?.nickname}さんの出退勤履歴`}</DialogTitle>
      <DialogContent dividers>content</DialogContent>
      <DialogActions>
        <ButtonGeneral label="閉じる" onClick={handleClose} />
      </DialogActions>
    </Dialog>
  );
};
