import * as React from 'react';
import { Box, Divider, Paper } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { Page } from '@/script/Pages/Page';
import {
  E_PAGES,
  getPagesHref,
  getPagesName,
} from '@/script/Enum/Server/App/EPages';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import { BackLink } from '@/script/Pages/Common/BackLink';
import { useIndexContext } from '@/script/Pages/Division/Show/Index';
import { LabelValue } from '@/script/Pages/Common/LabelValue';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { Avatar } from '@/script/Pages/Common/Avatar';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';
import { Log } from '@/script/Common/Log';
import { InertiaLink } from '@/script/Component/Misc/InertiaLink';

interface IProps extends IPropsBase {}
export const Show: React.FC<IProps> = () => {
  const { trnDivisionList } = useIndexContext();
  const trnDivision = trnDivisionList.first();

  /**
   * メンバー入替を選択.
   */
  const handleClickReplace = () => {
    Log.info('メンバー入替を選択');
  };

  return (
    <Page>
      <BackLink current={E_PAGES.DIVISION__SHOW} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <TypoH1>
          {getPagesName(E_PAGES.DIVISION__SHOW)}[{trnDivision.id}]
        </TypoH1>
        <InertiaLink
          href={getPagesHref(E_PAGES.DIVISION__SHOW, String(trnDivision.id))}
        >
          <ButtonGeneral
            sx={{
              minWidth: '140px',
            }}
            label="編集"
          />
        </InertiaLink>
      </Box>
      <Paper
        sx={{
          marginTop: '20px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <LabelValue label="id" value={String(trnDivision.id)} />
        <LabelValue label="名前" value={trnDivision.name} />
        <LabelValue
          valueSx={{
            whiteSpace: 'pre-wrap',
          }}
          label="説明"
          value={trnDivision.explain}
        />
        <Box>
          <Box sx={{ display: 'flex' }}>
            <Box>
              <TypoText sx={{ minWidth: '200px', width: '200px' }}>
                メンバー
              </TypoText>
              <ButtonGeneral
                sx={{
                  marginTop: '10px',
                }}
                label="入替"
                onClick={handleClickReplace}
              />
            </Box>
            <Box
              sx={{
                marginTop: '10px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              {trnDivision.trnDivisionUser?.map(trnDivisionUser => {
                return (
                  <Avatar
                    key={trnDivisionUser.id}
                    trnUser={trnDivisionUser.trnUser}
                  />
                );
              })}
            </Box>
          </Box>
          <Divider sx={{ marginTop: '6px' }} />
        </Box>
      </Paper>
    </Page>
  );
};
