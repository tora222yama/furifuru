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
import { LabelValue } from '@/script/Pages/Common/LabelValue';
import { useIndexContext } from '@/script/Pages/PersonalSetting/Show/Index';
import { Closable } from '@/script/Component/Misc/Closable';
import { E_COLOR } from '@/script/Enum/EColor';
import { InertiaLink } from '@/script/Component/Misc/InertiaLink';
import { useMutationAppPersonalSettingShowAlignSlack } from '@/script/Hooks/App/Mutations/useMutationAppPersonalSettingShowAlignSlack';
import { useProgressContext } from '@/script/Provider/ProgressProvider';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';
import { SlackInfo } from '@/script/Pages/PersonalSetting/Show/SlackInfo';
import { AuthenticatorInfo } from '@/script/Pages/PersonalSetting/Show/AuthenticatorInfo';
import { responsiveSize, responsiveSpacing } from '@/script/System/Responsive';

interface IProps extends IPropsBase {}
export const Show: React.FC<IProps> = () => {
  const { authUser } = useCommonIndexContext();
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
              minWidth: responsiveSize(140),
            }}
            label="編集"
          />
        </InertiaLink>
      </Box>
      <Closable open={!trnUserSlackProfile.slackUserId}>
        <Box
          sx={{
            marginTop: responsiveSpacing(4),
            border: `1px solid ${E_COLOR.PRIMARY_MAIN}`,
            backgroundColor: E_COLOR.WHITE,
            marginBottom: responsiveSpacing(4),
            padding: responsiveSpacing(2),
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
          marginTop: responsiveSpacing(4),
          padding: responsiveSpacing(4),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: responsiveSpacing(4),
          }}
        >
          <Image
            sx={{
              borderRadius: responsiveSize(24),
              width: responsiveSize(120),
              height: responsiveSize(120),
            }}
            src={String(authUser.trnUser?.faceImagePath)}
          />
          <Box sx={{ width: '100%' }}>
            <LabelValue label="名前" value={authUser.name} />
            <LabelValue
              sx={{ marginTop: responsiveSpacing(2) }}
              label="表示名"
              value={String(authUser.trnUser?.nickname)}
            />
          </Box>
        </Box>
        <SlackInfo
          sx={{
            marginTop: responsiveSpacing(4),
          }}
          trnUserSlackProfile={trnUserSlackProfile}
        />
        <AuthenticatorInfo
          sx={{
            marginTop: responsiveSpacing(4),
          }}
        />
      </Paper>
    </Page>
  );
};
