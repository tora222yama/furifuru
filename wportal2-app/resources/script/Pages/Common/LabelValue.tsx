import * as React from 'react';
import { Box, Divider, SxProps } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { TypoText } from '@/script/Component/Typography/TypoText';

interface IProps extends IPropsBase {
  label: string;
  value: string;
  labelSx?: SxProps;
  valueSx?: SxProps;
  showDivider?: boolean;
}
export const LabelValue: React.FC<IProps> = ({
  sx,
  label,
  value,
  labelSx,
  valueSx,
  showDivider = true,
}) => {
  return (
    <Box sx={{ ...sx }}>
      <Box sx={{ display: 'flex' }}>
        <TypoText sx={{ minWidth: '100px', width: '180px', ...labelSx }}>
          {label}
        </TypoText>
        <TypoText sx={{ ...valueSx }}>{value}</TypoText>
      </Box>
      {showDivider && <Divider sx={{ marginTop: '6px' }} />}
    </Box>
  );
};
