import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { responsiveSpacing } from '@/script/System/Responsive';
import { Paper } from '@mui/material';
import { EstablishedResult } from '@/script/Pages/ShuffleLunch/Established/EstabilshedResult';

interface IProps extends IPropsBase {}
export const Established: React.FC<IProps> = () => {
  return (
    <>
      <Paper
        sx={{
          marginTop: responsiveSpacing(4),
          padding: responsiveSpacing(4),
        }}
      >
        マッチ済み.
      </Paper>
      <EstablishedResult sx={{ marginTop: responsiveSpacing(4) }} />
    </>
  );
};
