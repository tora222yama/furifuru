import * as React from 'react';
import { Box, Paper } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { ITrnFacility } from '@/script/Models/App/TrnFacility';
import { TypoText } from '@/script/Component/Typography/TypoText';

interface IPros extends IPropsBase {
  trnFacility: ITrnFacility;
}
export const Facility: React.FC<IPros> = ({ sx, trnFacility }) => {
  return (
    <Paper
      sx={{
        padding: '20px',
        ...sx,
      }}
    >
      <TypoText>
        [{trnFacility.id}]{trnFacility.name}
      </TypoText>
      <TypoText>種別:{trnFacility.categoryId}</TypoText>
      <Box
        sx={{
          border: '1px solid',
          marginTop: '10px',
          padding: '5px',
        }}
      >
        <TypoText noWrap={false}>{trnFacility.explain}</TypoText>
      </Box>
    </Paper>
  );
};
