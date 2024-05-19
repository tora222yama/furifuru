import * as React from 'react';
import { Box, Divider, Paper } from '@mui/material';
import { router } from '@inertiajs/react';
import { IPropsBase } from '@/script/System/System';
import { Page } from '@/script/Pages/Page';
import {
  E_PAGES,
  getPagesHref,
  getPagesName,
} from '@/script/Enum/Server/App/EPages';
import { BackLink } from '@/script/Pages/Common/BackLink';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import { useIndexContext } from '@/script/Pages/Division/Edit/Index';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';
import { Avatar } from '@/script/Pages/Common/Avatar';
import { FormEdit, IFormEdit } from '@/script/Pages/Division/Edit/FormEdit';
import {
  IFormEditValidationResult,
  initialResult,
  validateAll,
} from '@/script/Pages/Division/Edit/FormEditValidation';
import { useProgressContext } from '@/script/Provider/ProgressProvider';
import { useMutationAppDivisionUpdate } from '@/script/Hooks/App/Mutations/useMutationAppDivisionUpdate';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';

interface IProps extends IPropsBase {}
export const Edit: React.FC<IProps> = () => {
  const { onStart, onFinish } = useProgressContext();
  const { trnDivisionList } = useIndexContext();
  const trnDivision = trnDivisionList.first();
  const [formEdit, setFormEdit] = React.useState<IFormEdit>({
    id: trnDivision.id,
    name: trnDivision.name,
    explain: trnDivision.explain,
  });
  const [validation, setValidation] =
    React.useState<IFormEditValidationResult>(initialResult);
  const [processingUpdate, mutationUpdate] = useMutationAppDivisionUpdate();
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
        trnDivisionId: formEdit.id,
        name: formEdit.name,
        explain: formEdit.explain,
      },
      [],
    ).then(res => {
      switch (res.statusCode) {
        case E_STATUS_CODE.OK:
          router.visit(
            getPagesHref(E_PAGES.DIVISION__SHOW, [
              {
                target: '$divisionId',
                value: String(trnDivision.id),
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

  return (
    <Page>
      <BackLink
        current={E_PAGES.DIVISION__EDIT}
        replace={[
          {
            target: '$divisionId',
            value: String(trnDivision.id),
          },
        ]}
      />
      <TypoH1>
        {getPagesName(E_PAGES.DIVISION__EDIT)}[{trnDivision.id}]
      </TypoH1>
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
