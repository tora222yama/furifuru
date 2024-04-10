import * as React from 'react';
import { Box, Paper } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { Page } from '@/script/Pages/Page';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { TypoSubTitle1 } from '@/script/Component/Typography/TypoSubTitle1';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';
import { useLazyFetchAppRedis } from '@/script/Hooks/App/Queries/useLazyFetchAppRedis';
import { Loading } from '@/script/Component/Misc/Loading';
import { useMutationActionAppRedisUpdate } from '@/script/Hooks/App/Mutations/useMutationActionAppRedisUpdate';
import { FormRedis, IFormRedis } from '@/script/Pages/Redis/FormRedis';
import {
  IFormRedisValidationResult,
  initialResult,
  parseServerValidation,
  validateAll,
} from '@/script/Pages/Redis/FormRedisValidation';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';
import { E_PAGES, getPagesName } from '@/script/Enum/Server/App/EPages';
import { FormRedisPost } from '@/script/Pages/Redis/FormRedisPost';

interface IProps extends IPropsBase {}
export const Redis: React.FC<IProps> = () => {
  const [formRedis, setFormRedis] = React.useState<IFormRedis>({
    storeValue: '',
  });
  const [validation, setValidation] =
    React.useState<IFormRedisValidationResult>(initialResult);
  const [loadingRedis, lazyFetch] = useLazyFetchAppRedis();
  const [processingRedis, mutationUpdate] = useMutationActionAppRedisUpdate();
  const [currentValue, setCurrentValue] = React.useState<string>('-');
  const loading = loadingRedis || processingRedis;

  /**
   * Redisの値を更新.
   */
  const handleUpdate = React.useCallback(
    (newValues: Partial<IFormRedis>) => {
      setFormRedis(prevState => ({ ...prevState, ...newValues }));
    },
    [setFormRedis],
  );

  /**
   * Redisの値を取得.
   */
  const handleClickLoad = () => {
    lazyFetch({
      sampleArgument: 'テスト引数-例えばIDとかを指定する',
    }).then(res => {
      setCurrentValue(res);
    });
  };

  /**
   * Redisへ値を保存.
   */
  const handleClickSave = () => {
    // バリデーション実行.
    const validation = validateAll(formRedis);
    setValidation(validation);

    // エラーがある場合は処理をしない.
    if (validation.hasError) {
      return;
    }

    // 更新処理の実施.
    mutationUpdate(
      {
        storeValue: formRedis.storeValue,
      },
      [],
    ).then(res => {
      switch (res.statusCode) {
        case E_STATUS_CODE.OK:
          setCurrentValue(formRedis.storeValue);
          break;
        case E_STATUS_CODE.UNPROCESSABLE_ENTITY:
          setValidation(parseServerValidation(res));
          break;
        default:
          break;
      }
    });
  };

  return (
    <Page>
      <TypoH1>{getPagesName(E_PAGES.REDIS)}</TypoH1>
      <Paper
        sx={{
          marginTop: '20px',
          padding: '10px',
        }}
      >
        <TypoSubTitle1>現在のRedisに保持している値を取得</TypoSubTitle1>
        <Box
          sx={{
            backgroundColor: 'primary.light',
            marginTop: '10px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Loading sx={{ width: '100%' }} loading={loading}>
            <TypoText>現在の値</TypoText>
            <TypoText
              sx={{
                marginLeft: '20px',
              }}
            >
              {currentValue}
            </TypoText>
          </Loading>
        </Box>
        <ButtonGeneral
          sx={{
            marginTop: '20px',
          }}
          label="取得"
          onClick={handleClickLoad}
          disabled={loading}
        />
      </Paper>
      <Paper
        sx={{
          marginTop: '20px',
          padding: '10px',
        }}
      >
        <TypoSubTitle1>入力した値をRedisに保存</TypoSubTitle1>
        <FormRedis
          sx={{
            marginTop: '10px',
          }}
          loading={loading}
          formRedis={formRedis}
          validation={validation}
          handleUpdate={handleUpdate}
          handleSaveGraphQL={handleClickSave}
        />
        <FormRedisPost loading={loading} formRedis={formRedis} />
      </Paper>
    </Page>
  );
};
