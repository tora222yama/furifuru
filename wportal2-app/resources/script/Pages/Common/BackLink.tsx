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
  IPagesHrefReplace,
} from '@/script/Enum/Server/App/EPages';

interface IProps extends IPropsBase {
  current: EPages;
  replace?: IPagesHrefReplace[];
}
export const BackLink: React.FC<IProps> = ({ current, replace = [] }) => {
  const backList = getPagesBack(current);
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '8px',
        gap: '10px',
      }}
    >
      {backList.map(back => {
        return (
          <React.Fragment key={back}>
            <ArrowBackIos sx={{ color: E_COLOR.BLACK }} />
            <InertiaLink href={getPagesHref(back, replace)}>
              <TypoText
                sx={{
                  textDecoration: 'underline',
                  marginRight: '20px',
                  '&:hover': {
                    color: E_COLOR.PRIMARY_DARK,
                  },
                }}
              >
                {getPagesName(back)}
              </TypoText>
            </InertiaLink>
          </React.Fragment>
        );
      })}
    </Box>
  );
};
