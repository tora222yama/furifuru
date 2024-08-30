import * as React from 'react';
import { Dialog, Paper } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { IDate } from '@/script/Pages/AttendanceEdit/MonthCalendar/IDate';
import {
  FormDialogEdit,
  IFormDialogEdit,
} from '@/script/Pages/AttendanceEdit/FormDialogEdit';

interface IProps extends IPropsBase {
  open: boolean;
  date?: IDate;
  handleClose: () => void;
}
export const DialogEdit: React.FC<IProps> = ({
  sx,
  open,
  date,
  handleClose,
}) => {
  const [formDialogEdit, setFormDialogEdit] = React.useState<IFormDialogEdit>({
    eventList: date?.eventList || [],
  });

  /**
   * 更新処理.
   */
  const handleUpdate = (newValues: Partial<IFormDialogEdit>) => {
    setFormDialogEdit({
      ...formDialogEdit,
      ...newValues,
    });
  };

  return (
    <Dialog sx={sx} open={open} onClose={handleClose}>
      <Paper
        sx={{
          padding: '20px',
        }}
      >
        <FormDialogEdit
          formDialogEdit={formDialogEdit}
          handleUpdate={handleUpdate}
          handleClose={handleClose}
        />
      </Paper>
    </Dialog>
  );
};
