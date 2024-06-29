import * as React from 'react';
import { Box, Paper } from '@mui/material';
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
import { Image } from '@/script/Component/Misc/Image';
import { LabelValue } from '@/script/Pages/Common/LabelValue';
import { E_ICON } from '@/script/Enum/EIcon';
import { TypoH2 } from '@/script/Component/Typography/TypoH2';
import { Icon } from '@/script/Component/Misc/Icon';
import { Closable } from '@/script/Component/Misc/Closable';

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
        <Closable open={false}>
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
        </Closable>
      </Box>
      <Paper sx={{ marginTop: '20px', padding: '20px' }}>
        <Box
          sx={{
            display: 'flex',
            gap: '20px',
          }}
        >
          <Image
            sx={{
              width: '120px',
              height: '120px',
              borderRadius: '24px',
            }}
            src={trnUser.faceImagePath}
          />
          <Box sx={{ width: '400px' }}>
            <LabelValue
              sx={{ marginTop: '10px' }}
              label="表示名"
              value={String(trnUser?.nickname)}
            />
          </Box>
        </Box>
        <Box
          sx={{
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Icon
            sx={{ width: '20px', height: '20px', marginRight: '5px' }}
            icon={E_ICON.BUILD}
          />
          <TypoH2>Slack情報</TypoH2>
        </Box>
        <LabelValue
          sx={{
            marginTop: '10px',
          }}
          label="Slack User ID"
          value={trnUser.trnUserSlackProfile?.slackUserId ?? '設定なし'}
        />
        <LabelValue
          sx={{
            marginTop: '10px',
          }}
          label="Slack User Name"
          value={trnUser.trnUserSlackProfile?.slackUserName ?? '設定なし'}
        />
        <LabelValue
          sx={{
            marginTop: '10px',
          }}
          label="Slack Team ID"
          value={trnUser.trnUserSlackProfile?.slackTeamId ?? '設定なし'}
        />
        <Closable open>
          <Box
            sx={{
              marginTop: '20px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Icon
              sx={{ width: '20px', height: '20px', marginRight: '5px' }}
              icon={E_ICON.BUILD}
            />
            <TypoH2>管理者向け情報</TypoH2>
          </Box>
          <LabelValue
            sx={{
              marginTop: '10px',
            }}
            label="Auth User ID"
            value={String(trnUser.authUser?.id ?? '')}
          />
          <LabelValue
            sx={{
              marginTop: '10px',
            }}
            label="レガシーログインの許可"
            value={trnUser.authUser?.eEnableLegacyLogin ? 'Yes' : 'No'}
          />
        </Closable>
      </Paper>
    </Page>
  );
};
