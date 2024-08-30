import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';
import { IEvent } from '@/script/Pages/AttendanceEdit/MonthCalendar/IEvent';

export interface IFormDialogEdit {
  eventList: IEvent[];
}

interface IProps extends IPropsBase {
  formDialogEdit: IFormDialogEdit;
  handleUpdate: (newValues: Partial<IFormDialogEdit>) => void;
  handleClose: () => void;
}
export const FormDialogEdit: React.FC<IProps> = ({
  sx,
  formDialogEdit,
  handleClose,
}) => {
  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      {formDialogEdit.eventList.map(event => {
        return <Box key={event.uid}>{event.label}</Box>;
      })}
      <ButtonGeneral onClick={handleClose}>閉じる</ButtonGeneral>
    </Box>
  );
};
