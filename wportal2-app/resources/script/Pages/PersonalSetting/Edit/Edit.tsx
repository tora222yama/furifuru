import * as React from 'react';
import { Paper } from '@mui/material';
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
import {
  IFormEditValidationResult,
  initialResult,
  validateAll,
} from '@/script/Pages/PersonalSetting/Edit/FormEditValidation';
import { useMutationAppPersonalSettingEditUpdate } from '@/script/Hooks/App/Mutations/useMutationAppPersonalSettingEditUpdate';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';
import { useProgressContext } from '@/script/Provider/ProgressProvider';
import { useIndexContext } from '@/script/Pages/PersonalSetting/Edit/Index';

interface IProps extends IPropsBase {}
export const Edit: React.FC<IProps> = () => {
  const { authUser, trnUser } = useCommonIndexContext();
  const { trnUserSlackProfile } = useIndexContext();
  const { onStart, onFinish } = useProgressContext();

  const [formEdit, setFormEdit] = React.useState<IFormEdit>({
    name: authUser.name,
    nickname: trnUser.nickname,
    slackUserId: trnUserSlackProfile.slackUserId,
    slackUserName: trnUserSlackProfile.slackUserName,
    slackTeamId: trnUserSlackProfile.slackTeamId,
  });
  const [validation, setValidation] =
    React.useState<IFormEditValidationResult>(initialResult);
  const [processingUpdate, mutationUpdate] =
    useMutationAppPersonalSettingEditUpdate();
  const loading = processingUpdate;

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

    // 更新処理の実施.
    onStart();
    mutationUpdate(
      {
        trnUserId: trnUser.id,
        nickname: formEdit.nickname,
        slackUserId: formEdit.slackUserId,
        slackUserName: formEdit.slackUserName,
        slackTeamId: formEdit.slackTeamId,
        upload: formEdit.upload,
      },
      [],
    ).then(res => {
      switch (res.statusCode) {
        case E_STATUS_CODE.OK:
          // 個人設定ページに移動.
          // 画像の再読み込みが必要なためフルリロードを実施し、画面ロードは継続する.
          window.location.href = getPagesHref(E_PAGES.PERSONAL_SETTING__SHOW);
          break;
        default:
          onFinish();
          break;
      }
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
          loading={loading}
          formEdit={formEdit}
          validation={validation}
          handleUpdate={handleUpdate}
          handleSubmit={handleSubmit}
        />
      </Paper>
    </Page>
  );
};
