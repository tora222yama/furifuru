import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';

interface IProps extends IPropsBase {}
export const Logo: React.FC<IProps> = ({ sx }) => {
  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      <TypoH1>Web本部ポータル</TypoH1>
    </Box>
  );
};
