import * as React from 'react';
import { Box, Divider, SxProps } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { TypoText } from '@/script/Component/Typography/TypoText';

interface IProps extends IPropsBase {
  label: string;
  value: string;
  labelSx?: SxProps;
  valueSx?: SxProps;
}
export const LabelValue: React.FC<IProps> = ({
  sx,
  label,
  value,
  labelSx,
  valueSx,
}) => {
  return (
    <Box sx={{ ...sx }}>
      <Box sx={{ display: 'flex' }}>
        <TypoText sx={{ minWidth: '200px', width: '200px', ...labelSx }}>
          {label}
        </TypoText>
        <TypoText sx={{ ...valueSx }}>{value}</TypoText>
      </Box>
      <Divider sx={{ marginTop: '6px' }} />
    </Box>
  );
};
