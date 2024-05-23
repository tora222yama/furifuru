import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { Page } from '@/script/Pages/Page';
import { BackLink } from '@/script/Pages/Common/BackLink';
import {
  E_PAGES,
  getPagesHref,
  getPagesName,
} from '@/script/Enum/Server/App/EPages';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import { useIndexContext } from '@/script/Pages/User/Show/Index';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';
import { InertiaLink } from '@/script/Component/Misc/InertiaLink';

interface IProps extends IPropsBase {}
export const Show: React.FC<IProps> = () => {
  const { trnUser } = useIndexContext();

  return (
    <Page>
      <BackLink current={E_PAGES.USER__SHOW} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <TypoH1>
          {getPagesName(E_PAGES.USER__SHOW)}[{trnUser.id}]
        </TypoH1>
        <InertiaLink
          href={getPagesHref(E_PAGES.USER__EDIT, [
            {
              target: '$userId',
              value: String(trnUser.id),
            },
          ])}
        >
          <ButtonGeneral
            sx={{
              minWidth: '140px',
            }}
            label="編集"
          />
        </InertiaLink>
      </Box>
    </Page>
  );
};
