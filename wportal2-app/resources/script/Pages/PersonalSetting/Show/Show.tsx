import * as React from 'react';
import { Box, Paper, Grid } from '@mui/material';
import { router } from '@inertiajs/react';
import { IPropsBase } from '@/script/System/System';
import { Page } from '@/script/Pages/Page';
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
import {
  E_PAGES,
  getPagesHref,
  getPagesName,
} from '@/script/Enum/Server/App/EPages';

interface IProps extends IPropsBase {}
export const Show: React.FC<IProps> = () => {
  const { authUser } = useCommonIndexContext();
  const { trnUserSlackProfile } = useIndexContext();
  const { onStart, onFinish } = useProgressContext();
  const [processingAlignSlack, mutationAlignSlack] =
    useMutationAppPersonalSettingShowAlignSlack();
  const loading = processingAlignSlack;

  // 生年月日をYYYY/MM/DD形式に変換
  const formatDate = (dataString: string | null) => {
    if (!dataString) {
      return '';
    }
    const date = new Date(dataString);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}/${month}/${day}`;
  };

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
        <Grid sx={{ width: '600px' }}>
          <Grid>
            <Image
              sx={{
                borderRadius: '24px',
                width: '130px',
                height: '130px',
              }}
              src={String(authUser.trnUser?.faceImagePath)}
            />
          </Grid>
          <Grid sx={{ marginTop: '35px' }}>
            <LabelValue label="名前" value={authUser.name} />
            <LabelValue
              sx={{ marginTop: '10px' }}
              label="表示名"
              value={String(authUser.trnUser?.nickname)}
            />
            <LabelValue
              sx={{ marginTop: '10px' }}
              label="生年月日"
              value={
                authUser.trnUser?.birthDate
                  ? formatDate(authUser.trnUser.birthDate)
                  : ''
              }
            />
          </Grid>
          <Grid>
            <SlackInfo
              sx={{
                marginTop: '35px',
              }}
              trnUserSlackProfile={trnUserSlackProfile}
            />
          </Grid>
          <Grid>
            <TypoText
              sx={{
                fontSize: '20px',
                marginBottom: '10px',
                paddingTop: '35px',
              }}
            >
              自己紹介
            </TypoText>
            <Box
              sx={{
                display: 'inline-block',
                borderRadius: '8px',
                width: '700px',
                maxWidth: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                height: '10em',
                overflowY: 'auto',
              }}
            >
              <TypoText
                sx={{
                  whiteSpace: 'pre-wrap',
                  fontSize: '14px',
                  color: authUser.trnUser?.selfIntroduction
                    ? 'inherit'
                    : `${E_COLOR.GREY}`,
                }}
              >
                {String(authUser.trnUser?.selfIntroduction) ||
                  '何も入力されていません'}
              </TypoText>
            </Box>
          </Grid>
          <AuthenticatorInfo
            sx={{
              marginTop: '20px',
            }}
          />
        </Grid>
      </Paper>
    </Page>
  );
};
