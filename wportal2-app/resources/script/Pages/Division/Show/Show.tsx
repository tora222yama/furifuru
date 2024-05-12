import * as React from 'react';
import { router } from '@inertiajs/react';
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
import { InertiaLink } from '@/script/Component/Misc/InertiaLink';
import { DialogReplaceTrnUser } from '@/script/Pages/Common/Dialog/DialogReplaceTrnUser';
import { Closable } from '@/script/Component/Misc/Closable';
import { useMutationAppDivisionUserUpdate } from '@/script/Hooks/App/Mutations/useMutationAppDivisionUserUpdate';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';
import { useProgressContext } from '@/script/Provider/ProgressProvider';

interface IProps extends IPropsBase {}
export const Show: React.FC<IProps> = () => {
  const { onStart, onFinish } = useProgressContext();
  const { trnDivisionList } = useIndexContext();
  const trnDivision = trnDivisionList.first();
  const [openReplace, setOpenReplace] = React.useState<boolean>(false);
  const [, mutationUpdate] = useMutationAppDivisionUserUpdate();

  /**
   * メンバー入替を選択.
   */
  const handleClickReplace = () => {
    setOpenReplace(true);
  };

  /**
   * メンバー入替の送信.
   */
  const handleSubmitReplace = (newValues: number[]) => {
    onStart();
    setOpenReplace(false);
    mutationUpdate(
      {
        trnDivisionId: trnDivision.id,
        trnUserIdList: newValues,
      },
      [],
    ).then(res => {
      onFinish();
      switch (res.statusCode) {
        case E_STATUS_CODE.OK:
          router.reload({
            preserveState: true,
            replace: true,
            onStart,
            onFinish,
          });
          break;
        default:
          break;
      }
    });
  };

  return (
    <Page>
      <Closable open={openReplace}>
        <DialogReplaceTrnUser
          open={openReplace}
          defaultUserIdList={
            trnDivision.trnDivisionUser?.map(v => v.trnUserId) ?? []
          }
          handleSubmit={handleSubmitReplace}
          handleClose={() => setOpenReplace(false)}
        />
      </Closable>
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
