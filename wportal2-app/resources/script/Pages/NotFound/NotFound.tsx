import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { Page } from '@/script/Pages/Page';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';

interface IProps extends IPropsBase {}
export const NotFound: React.FC<IProps> = () => {
  return (
    <Page>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '100px',
        }}
      >
        <TypoText>お探しのページは見つかりませんでした</TypoText>
        <ButtonGeneral
          sx={{
            marginTop: '20px',
          }}
          label="トップページに戻る"
          href="/"
        />
      </Box>
    </Page>
  );
};
