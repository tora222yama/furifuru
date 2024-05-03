import * as React from 'react';
import { Box } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';
import { IPropsBase } from '@/script/System/System';
import { E_COLOR } from '@/script/Enum/EColor';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { InertiaLink } from '@/script/Component/Misc/InertiaLink';
import {
  EPages,
  getPagesBack,
  getPagesHref,
  getPagesName,
} from '@/script/Enum/Server/App/EPages';

interface IProps extends IPropsBase {
  current: EPages;
}
export const BackLink: React.FC<IProps> = ({ current }) => {
  const back = getPagesBack(current);
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '8px',
      }}
    >
      <ArrowBackIos sx={{ color: E_COLOR.BLACK }} />
      <InertiaLink href={getPagesHref(back)}>
        <TypoText
          sx={{
            textDecoration: 'underline',
            '&:hover': {
              color: E_COLOR.PRIMARY_DARK,
            },
          }}
        >
          {getPagesName(back)}
        </TypoText>
      </InertiaLink>
    </Box>
  );
};
