import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { IAppTrnProject } from '@/script/Models/App/Trn/TrnProjectList';
import { E_COLOR } from '@/script/Enum/EColor';
import { TypoH2 } from '@/script/Component/Typography/TypoH2';
import { AttendanceState } from '@/script/Pages/Attendance/AttendanceState';
import { useIndexContext } from '@/script/Pages/Attendance/Index';
import { E_WORKING_PLACE } from '@/script/Enum/Server/App/EWorkingPlace';

interface IProps extends IPropsBase {
  trnProject: IAppTrnProject;
}
export const ProjectBlock: React.FC<IProps> = ({ sx, trnProject }) => {
  const { stateList } = useIndexContext();
  const projectUserIdList = trnProject.trnProjectUser?.map(v => v.trnUserId);
  const projectStateList = stateList.filter(state =>
    projectUserIdList?.includes(state.trnUser.id),
  );

  return (
    <Box
      sx={{
        marginTop: '10px',
        padding: '10px',
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: E_COLOR.PRIMARY_LIGHT,
            width: 'fit-content',
            padding: '5px 40px 5px 40px',
            borderRadius: '4px',
          }}
        >
          <TypoH2>{trnProject.name}</TypoH2>
        </Box>
        <Box>TODO:PRIORITY</Box>
      </Box>
      <AttendanceState
        sx={{ marginTop: '10px' }}
        label="オフィス"
        stateList={projectStateList
          .filter(state => state.isWorking)
          .filter(state => state.workingPlace === E_WORKING_PLACE.OFFICE)}
      />
      <AttendanceState
        label="在宅"
        stateList={projectStateList
          .filter(state => state.isWorking)
          .filter(state => state.workingPlace === E_WORKING_PLACE.HOME)}
      />
      <AttendanceState
        label="不在"
        stateList={projectStateList.filter(state => !state.isWorking)}
      />
    </Box>
  );
};
