import * as React from 'react';
import { router } from '@inertiajs/react';
import { Box, Divider, Paper } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { BackLink } from '@/script/Pages/Common/BackLink';
import {
  E_PAGES,
  getPagesHref,
  getPagesName,
} from '@/script/Enum/Server/App/EPages';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import { useIndexContext } from '@/script/Pages/Project/Edit/Index';
import { Page } from '@/script/Pages/Page';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { Avatar } from '@/script/Pages/Common/Avatar';
import { FormEdit, IFormEdit } from '@/script/Pages/Project/Edit/FormEdit';
import {
  IFormEditValidationResult,
  initialResult,
  validateAll,
} from '@/script/Pages/Project/Edit/FormEditValidation';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';
import { useMutationAppProjectUpdate } from '@/script/Hooks/App/Mutations/useMutationAppProjectUpdate';
import { useProgressContext } from '@/script/Provider/ProgressProvider';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';
import { DialogYesNo } from '@/script/Component/Misc/DialogYesNo';
import { Closable } from '@/script/Component/Misc/Closable';

interface IProps extends IPropsBase {}

export const Edit: React.FC<IProps> = () => {
  const { onStart, onFinish } = useProgressContext();
  const { trnProjectList } = useIndexContext();
  const trnProject = trnProjectList.first();
  const [formEdit, setFormEdit] = React.useState<IFormEdit>({
    id: trnProject.id,
    name: trnProject.name,
    explain: trnProject.explain,
  });
  const [validation, setValidation] =
    React.useState<IFormEditValidationResult>(initialResult);
  const [processingUpdate, mutationUpdate] = useMutationAppProjectUpdate();
  const loading = processingUpdate;
  const [openConfirm, setOpenConfirm] = React.useState<boolean>(false);

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
        trnProjectId: formEdit.id,
        name: formEdit.name,
        explain: formEdit.explain,
      },
      [],
    ).then(res => {
      switch (res.statusCode) {
        case E_STATUS_CODE.OK:
          router.visit(
            getPagesHref(E_PAGES.PROJECT__SHOW, [
              {
                target: '$projectId',
                value: String(trnProject.id),
              },
            ]),
            {
              onStart,
              onFinish,
            },
          );
          break;
        default:
          onFinish();
          break;
      }
    });
  };

  // にすみん自作エリア、プロジェクト削除用関数
  function deleteProjectNis(): void {
    // 更新の実施.
    router.visit(
      getPagesHref(E_PAGES.PROJECT__DELETE, [
        {
          target: '$projectId',
          value: String(trnProject.id),
        },
      ]),
      {
        method: 'post',
        onStart,
        onFinish,
      },
    );
  }

  return (
    <Page>
      <Closable open={openConfirm}>
        <DialogYesNo
          open={openConfirm}
          labels={{
            content: '現在開いているプロジェクトを削除しますか？',
          }}
          actions={{
            submit: deleteProjectNis,
            close: () => setOpenConfirm(false),
          }}
        />
      </Closable>
      <BackLink
        current={E_PAGES.PROJECT__EDIT}
        replace={[
          {
            target: '$projectId',
            value: String(trnProject.id),
          },
        ]}
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <TypoH1>
          {getPagesName(E_PAGES.PROJECT__EDIT)}[{trnProject.id}]
        </TypoH1>
        <ButtonGeneral
          sx={{
            width: '200px',
          }}
          label="プロジェクトを削除"
          onClick={() => setOpenConfirm(true)}
          disabled={loading}
        />
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
        <FormEdit
          formEdit={formEdit}
          validation={validation}
          handleUpdate={handleUpdate}
        />
        <Box>
          <Box sx={{ display: 'flex' }}>
            <Box>
              <TypoText sx={{ minWidth: '200px', width: '200px' }}>
                メンバー
              </TypoText>
            </Box>
            <Box
              sx={{
                marginTop: '10px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              {trnProject.trnProjectUser?.map(trnProjectUser => {
                return (
                  <Avatar
                    key={trnProjectUser.id}
                    trnUser={trnProjectUser.trnUser}
                  />
                );
              })}
            </Box>
          </Box>
          <Divider sx={{ marginTop: '6px' }} />
        </Box>
        <ButtonGeneral
          sx={{
            width: '200px',
          }}
          label="更新"
          onClick={handleSubmit}
          disabled={loading}
        />
      </Paper>
    </Page>
  );
};
