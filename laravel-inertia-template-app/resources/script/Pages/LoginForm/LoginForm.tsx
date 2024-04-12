import * as React from 'react';
import { Paper } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import { E_PAGES, getPagesName } from '@/script/Enum/Server/App/EPages';
import { Page } from '@/script/Pages/Page';
import { TypoText } from '@/script/Component/Typography/TypoText';
import {
  FormLoginForm,
  IFormLoginForm,
} from '@/script/Pages/LoginForm/FormLoginForm';
import { TypoH3 } from '@/script/Component/Typography/TypoH3';
import { useMutationActionAppLoginFormLogin } from '@/script/Hooks/App/Mutations/useMutationActionAppLoginFormLogin';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';
import { Log } from '@/script/Common/Log';
import { useIndexContext } from '@/script/Provider/IndexProvider';
import { Closable } from '@/script/Component/Misc/Closable';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';
import { useMutationActionAppLoginFormLogout } from '@/script/Hooks/App/Mutations/useMutationActionAppLoginFormLogout';
import { useMutationActionAppLoginFormCheck } from '@/script/Hooks/App/Mutations/useMutationActionAppLoginFormCheck';
import { E_COLOR } from '@/script/Enum/EColor';

interface IProps extends IPropsBase {}
export const LoginForm: React.FC<IProps> = () => {
  const { authUser } = useIndexContext();
  const [formLoginForm, setFormLoginForm] = React.useState<IFormLoginForm>({
    email: '',
    password: '',
  });
  const [processingLogin, mutationLogin] = useMutationActionAppLoginFormLogin();
  const [processingLogout, mutationLogout] =
    useMutationActionAppLoginFormLogout();
  const [processingCheck, mutationCheck] = useMutationActionAppLoginFormCheck();
  const loading = processingLogin || processingLogout || processingCheck;

  /**
   * ログイン情報を更新.
   */
  const handleUpdate = React.useCallback(
    (newValues: Partial<IFormLoginForm>) => {
      setFormLoginForm(prevState => ({ ...prevState, ...newValues }));
    },
    [setFormLoginForm],
  );

  /**
   * ログインの実施.
   */
  const handleSubmitLogin = () => {
    mutationLogin(
      {
        email: formLoginForm.email,
        password: formLoginForm.password,
      },
      [],
    ).then(res => {
      switch (res.statusCode) {
        case E_STATUS_CODE.OK:
          window.location.replace('/login_form');
          break;
        default:
          Log.error('login failed.');
          break;
      }
    });
  };

  /**
   * ログアウトの実施.
   */
  const handleSubmitLogout = () => {
    mutationLogout([]).then(res => {
      switch (res.statusCode) {
        case E_STATUS_CODE.OK:
          window.location.replace('/login_form');
          break;
        default:
          Log.error('logout failed.');
          break;
      }
    });
  };

  /**
   * guardチェックの実施.
   */
  const handleSubmitCheck = () => {
    mutationCheck([]).then();
  };

  return (
    <Page>
      <TypoH1>{getPagesName(E_PAGES.LOGIN_FORM)}</TypoH1>
      <Paper
        sx={{
          marginTop: '20px',
          padding: '10px',
        }}
      >
        <TypoH3>ID/PASSによるログイン</TypoH3>
        <TypoText sx={{ marginTop: '5px' }}>
          ※入力値に関係なく成功し、ユーザー[template]でログインします
        </TypoText>
        <FormLoginForm
          loading={loading}
          formLoginForm={formLoginForm}
          handleUpdate={handleUpdate}
          handleSubmitLogin={handleSubmitLogin}
        />
      </Paper>
      <Paper
        sx={{
          marginTop: '20px',
          padding: '10px',
        }}
      >
        <TypoText>
          未ログインで実行するとエラーとなるボタン(guard確認用)
        </TypoText>
        <ButtonGeneral
          sx={{
            marginTop: '10px',
          }}
          label="guardチェック実施"
          onClick={handleSubmitCheck}
          disabled={loading}
        />
        <TypoText sx={{ marginTop: '10px' }} color={E_COLOR.TEXT_RED}>
          ※未ログインで実行するとブラウザのコンソールに「Unauthenticated」のエラーが表示されます
        </TypoText>
      </Paper>
      <TypoText sx={{ marginTop: '20px' }}>
        ※ログアウトのボタンはログイン状態のみ表示
      </TypoText>
      <Closable open={!!authUser.id}>
        <Paper
          sx={{
            marginTop: '10px',
            padding: '10px',
          }}
        >
          <ButtonGeneral
            label="ログアウト"
            onClick={handleSubmitLogout}
            disabled={loading}
          />
        </Paper>
      </Closable>
    </Page>
  );
};
