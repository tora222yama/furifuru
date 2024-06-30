import * as React from 'react';
import { Paper } from '@mui/material';
import { router } from '@inertiajs/react';
import { IPropsBase } from '@/script/System/System';
import { BackLink } from '@/script/Pages/Common/BackLink';
import {
  E_PAGES,
  getPagesHref,
  getPagesName,
} from '@/script/Enum/Server/App/EPages';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import { Page } from '@/script/Pages/Page';
import { useIndexContext } from '@/script/Pages/User/Edit/Index';
import { FormEdit, IFormEdit } from '@/script/Pages/User/Edit/FormEdit';
import { useProgressContext } from '@/script/Provider/ProgressProvider';

interface IProps extends IPropsBase {}
export const Edit: React.FC<IProps> = () => {
  const { trnUser } = useIndexContext();
  const { onStart, onFinish } = useProgressContext();
  const [formEdit, setFormEdit] = React.useState<IFormEdit>({
    enableLegacyLogin: false,
    overwritePassword: '',
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
    // TODO: 必用があればバリデーション.

    // 更新処理の実施.
    router.visit(getPagesHref(E_PAGES.USER__UPDATE), {
      method: 'post',
      preserveState: true,
      preserveScroll: true,
      data: {
        authId: trnUser.authId,
        trnUserId: trnUser.id,
        enableLegacyLogin: formEdit.enableLegacyLogin,
        overwritePassword: formEdit.overwritePassword,
      },
      onStart,
      onFinish,
    });
  };

  return (
    <Page>
      <BackLink
        current={E_PAGES.USER__EDIT}
        replace={[
          {
            target: '$userId',
            value: String(trnUser.id),
          },
        ]}
      />
      <TypoH1>{getPagesName(E_PAGES.USER__EDIT)}</TypoH1>
      <Paper
        sx={{
          marginTop: '20px',
          padding: '20px',
        }}
      >
        <FormEdit
          sx={{
            width: '100%',
          }}
          formEdit={formEdit}
          handleUpdate={handleUpdate}
          handleSubmit={handleSubmit}
        />
      </Paper>
    </Page>
  );
};
