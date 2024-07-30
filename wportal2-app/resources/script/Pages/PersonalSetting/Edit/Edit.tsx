import * as React from 'react';
import { Paper } from '@mui/material';
import { router } from '@inertiajs/react';
import { IPropsBase } from '@/script/System/System';
import { useCommonIndexContext } from '@/script/Provider/CommonIndexProvider';
import {
  E_PAGES,
  getPagesHref,
  getPagesName,
} from '@/script/Enum/Server/App/EPages';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import { Page } from '@/script/Pages/Page';
import { BackLink } from '@/script/Pages/Common/BackLink';
import {
  FormEdit,
  IFormEdit,
} from '@/script/Pages/PersonalSetting/Edit/FormEdit';
import { validateAll } from '@/script/Pages/PersonalSetting/Edit/FormEditValidation';
import { useProgressContext } from '@/script/Provider/ProgressProvider';
import { useIndexContext } from '@/script/Pages/PersonalSetting/Edit/Index';

interface IProps extends IPropsBase {}
export const Edit: React.FC<IProps> = () => {
  const { authUser } = useCommonIndexContext();
  const { onStart, onFinish } = useProgressContext();
  const { trnUserSlackProfile, validation, setValidation } = useIndexContext();

  const [formEdit, setFormEdit] = React.useState<IFormEdit>({
    name: authUser.name,
    nickname: authUser.trnUser?.nickname ?? '',
    birthDate: authUser.trnUser?.birthDate ?? '',
    slackUserId: trnUserSlackProfile.slackUserId,
    slackUserName: trnUserSlackProfile.slackUserName,
    slackTeamId: trnUserSlackProfile.slackTeamId,
  });

  /**
   * 値の更新.
   */
  const handleUpdate = React.useCallback(
    (newValues: Partial<IFormEdit>) => {
      setFormEdit(prevState => ({ ...prevState, ...newValues }));
    },
    [setFormEdit],
  );

  /**
   * 値の送信.
   */
  const handleSubmit = () => {
    // バリデーション実施.
    const validation = validateAll(formEdit);
    setValidation(validation);

    // エラーがある場合は処理をしない.
    if (validation.hasError) {
      return;
    }

    const birthDate = formEdit.birthDate === '' ? null : formEdit.birthDate;

    // 更新処理の実施.
    router.visit(getPagesHref(E_PAGES.PERSONAL_SETTING__UPDATE), {
      method: 'post',
      preserveState: true,
      preserveScroll: true,
      data: {
        trnUserId: authUser.trnUser?.id ?? 0,
        nickname: formEdit.nickname,
        birthDate: formEdit.birthDate,
        slackUserId: formEdit.slackUserId,
        slackUserName: formEdit.slackUserName,
        slackTeamId: formEdit.slackTeamId,
        upload: formEdit.upload,
      },
      onStart,
      onFinish,
    });
  };

  return (
    <Page>
      <BackLink current={E_PAGES.PERSONAL_SETTING__EDIT} />
      <TypoH1>{getPagesName(E_PAGES.PERSONAL_SETTING__EDIT)}</TypoH1>
      <Paper
        sx={{
          marginTop: '20px',
          padding: '20px',
        }}
      >
        <FormEdit
          formEdit={formEdit}
          validation={validation}
          handleUpdate={handleUpdate}
          handleSubmit={handleSubmit}
        />
      </Paper>
    </Page>
  );
};
