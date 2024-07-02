import * as React from 'react';
import { Paper } from '@mui/material';
import { router } from '@inertiajs/react';
import { E_COLOR } from '@/script/Enum/EColor';
import { IPropsBase } from '@/script/System/System';
import {
  FormLegacyLogin,
  IFormLegacyLogin,
} from '@/script/Pages/Login/FormLegacyLogin';
import { useProgressContext } from '@/script/Provider/ProgressProvider';
import { E_PAGES, getPagesHref } from '@/script/Enum/Server/App/EPages';

interface IProps extends IPropsBase {}
export const CardLegacyLogin: React.FC<IProps> = () => {
  const { onStart, onFinish } = useProgressContext();
  const [formLegacyLogin, setFormLegacyLogin] =
    React.useState<IFormLegacyLogin>({
      email: '',
      password: '',
    });

  /**
   * 値の更新.
   */
  const handleUpdate = React.useCallback(
    (newValues: Partial<IFormLegacyLogin>) => {
      setFormLegacyLogin(prevState => ({ ...prevState, ...newValues }));
    },
    [setFormLegacyLogin],
  );

  /**
   * 値の送信.
   */
  const handleSubmit = () => {
    // TODO: バリデーションが必要であれば.

    // 更新処理の実装.
    router.visit(getPagesHref(E_PAGES.LEGACY_LOGIN), {
      method: 'post',
      preserveState: true,
      preserveScroll: true,
      data: {},
      onStart,
      onFinish,
    });
  };

  return (
    <Paper
      sx={{
        padding: '20px',
        width: '460px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: E_COLOR.GREY_LIGHT,
      }}
    >
      <FormLegacyLogin
        formLegacyLogin={formLegacyLogin}
        handleUpdate={handleUpdate}
        handleSubmit={handleSubmit}
      />
    </Paper>
  );
};
