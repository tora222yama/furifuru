import * as React from 'react';
import { Box, Divider } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { TypoText } from '@/script/Component/Typography/TypoText';

interface IProps extends IPropsBase {
  label: string;
  value: string;
}
export const LabelValue: React.FC<IProps> = ({ sx, label, value }) => {
  return (
    <Box sx={{ ...sx }}>
      <Box sx={{ display: 'flex' }}>
        <TypoText sx={{ minWidth: '200px', width: '200px' }}>{label}</TypoText>
        <TypoText>{value}</TypoText>
      </Box>
      <Divider sx={{ marginTop: '6px' }} />
    </Box>
  );
};
