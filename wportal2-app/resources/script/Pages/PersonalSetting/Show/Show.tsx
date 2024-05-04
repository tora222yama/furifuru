import * as React from 'react';
import { router } from '@inertiajs/react';
import { Box, Paper } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { Page } from '@/script/Pages/Page';
import {
  E_PAGES,
  getPagesHref,
  getPagesName,
} from '@/script/Enum/Server/App/EPages';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';
import { useCommonIndexContext } from '@/script/Provider/CommonIndexProvider';
import { Image } from '@/script/Component/Misc/Image';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { TypoH2 } from '@/script/Component/Typography/TypoH2';
import { LabelValue } from '@/script/Pages/Common/LabelValue';
import { useIndexContext } from '@/script/Pages/PersonalSetting/Show/Index';
import { Str } from '@/script/Common/Str';
import { Closable } from '@/script/Component/Misc/Closable';
import { E_COLOR } from '@/script/Enum/EColor';
import { InertiaLink } from '@/script/Component/Misc/InertiaLink';
import { useMutationAppPersonalSettingShowAlignSlack } from '@/script/Hooks/App/Mutations/useMutationAppPersonalSettingShowAlignSlack';
import { useProgressContext } from '@/script/Provider/ProgressProvider';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';

interface IProps extends IPropsBase {}
export const Show: React.FC<IProps> = () => {
  const { authUser, trnUser } = useCommonIndexContext();
  const { trnUserSlackProfile } = useIndexContext();
  const { onStart, onFinish } = useProgressContext();
  const [processingAlignSlack, mutationAlignSlack] =
    useMutationAppPersonalSettingShowAlignSlack();
  const loading = processingAlignSlack;

  /**
   * SlackIdの有効化を実行.
   */
  const handleClickSlackId = () => {
    onStart();
    mutationAlignSlack([]).then(res => {
      onFinish();
      if (res.statusCode === E_STATUS_CODE.OK) {
        router.reload({
          preserveState: true,
          replace: true,
          onStart,
          onFinish,
          only: ['trnUserSlackProfile'],
        });
      }
    });
  };

  return (
    <Page>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <TypoH1>{getPagesName(E_PAGES.PERSONAL_SETTING__SHOW)}</TypoH1>
        <InertiaLink href={getPagesHref(E_PAGES.PERSONAL_SETTING__EDIT)}>
          <ButtonGeneral
            sx={{
              minWidth: '140px',
            }}
            label="編集"
          />
        </InertiaLink>
      </Box>
      <Closable open={!trnUserSlackProfile.slackUserId}>
        <Box
          sx={{
            marginTop: '20px',
            border: `1px solid ${E_COLOR.PRIMARY_MAIN}`,
            backgroundColor: E_COLOR.WHITE,
            marginBottom: '20px',
            padding: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TypoText>有効なSlackIDが設定されていません</TypoText>
          <ButtonGeneral
            label="SlackIDを有効化する"
            onClick={handleClickSlackId}
            disabled={loading}
          />
        </Box>
      </Closable>
      <Paper
        sx={{
          marginTop: '20px',
          padding: '20px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <Image
            sx={{
              borderRadius: '24px',
              width: '120px',
              height: '120px',
            }}
            src={trnUser.faceImagePath}
          />
          <Box sx={{ width: '400px' }}>
            <LabelValue label="名前" value={authUser.name} />
            <LabelValue
              sx={{ marginTop: '10px' }}
              label="表示名"
              value={trnUser.nickname}
            />
          </Box>
        </Box>
        <Box
          sx={{
            marginTop: '20px',
          }}
        >
          <TypoH2>Slack情報</TypoH2>
          <Box
            sx={{
              width: '400px',
              marginTop: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <LabelValue
              label="Slack User ID"
              value={
                Str.exceptEmpty(trnUserSlackProfile.slackUserId) ?? '設定なし'
              }
            />
            <LabelValue
              label="Slack User Name"
              value={
                Str.exceptEmpty(trnUserSlackProfile.slackUserName) ?? '設定なし'
              }
            />
            <LabelValue
              label="Slack Team ID"
              value={
                Str.exceptEmpty(trnUserSlackProfile.slackTeamId) ?? '設定なし'
              }
            />
          </Box>
        </Box>
      </Paper>
    </Page>
  );
};
