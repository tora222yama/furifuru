import * as React from 'react';
import { Box, Paper } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { E_COLOR } from '@/script/Enum/EColor';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { TypoH2 } from '@/script/Component/Typography/TypoH2';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';
import { E_ICON } from '@/script/Enum/EIcon';
import { Icon } from '@/script/Component/Misc/Icon';

interface IProps extends IPropsBase {}
export const Login: React.FC<IProps> = () => {
  return (
    <Box
      sx={{
        backgroundColor: E_COLOR.GREY_LIGHT,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        sx={{
          padding: '20px',
          width: '340px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <TypoH2>Web本部ポータル</TypoH2>
        <TypoText>Build:{import.meta.env.VITE_BUILD}</TypoText>
        <ButtonGeneral
          sx={{
            marginTop: '20px',
            width: '100%',
            height: '80px',
          }}
          href="/auth/google"
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Icon icon={E_ICON.GOOGLE} />
            <TypoText>Googleアカウントで認証</TypoText>
          </Box>
        </ButtonGeneral>
      </Paper>
    </Box>
  );
};
