import * as React from 'react';
import { Box, Button, Paper } from '@mui/material';
import { useMvcValueContext } from '@/script/Pages/Sample/MvcValue/Index';
import { Page } from '@/script/Pages/Page';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import { E_PAGES, getPagesName } from '@/script/Enum/Server/App/EPages';
import { Log } from '@/script/Common/Log';
import { TypoH3 } from '@/script/Component/Typography/TypoH3';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { useCommonIndexContext } from '@/script/Provider/CommonIndexProvider';
import { IPropsBase } from '@/script/System/System';
import { Facility } from '@/script/Pages/Sample/MvcValue/Facility';

interface IPros extends IPropsBase {}
export const MvcValue: React.FC<IPros> = () => {
  const { location } = useCommonIndexContext();
  const { numberValue, stringValue, arrayValue, trnUserList } =
    useMvcValueContext();

  const handleClick = () => {
    Log.info('クリックされた');
  };

  return (
    <Page>
      <TypoH1>{getPagesName(E_PAGES.SAMPLE_MVC_VALUE)}</TypoH1>
      <Paper
        sx={{
          marginTop: '20px',
          padding: '5px',
        }}
      >
        number: {numberValue}
      </Paper>
      <Paper
        sx={{
          marginTop: '10px',
          padding: '5px',
        }}
      >
        string: {stringValue}
      </Paper>
      <Paper
        sx={{
          marginTop: '10px',
          padding: '5px',
        }}
      >
        {arrayValue.map(v => {
          return <Box key={v}>{v}</Box>;
        })}
      </Paper>
      <Paper
        sx={{
          marginTop: '10px',
          padding: '5px',
        }}
      >
        <TypoText>location: {location.current}</TypoText>
        <TypoText>path: {location.path}</TypoText>
      </Paper>
      <Button
        sx={{
          marginTop: '10px',
        }}
        style={{ background: '#F00' }}
        onClick={() => handleClick()}
      >
        test
      </Button>
      <TypoH3
        sx={{
          marginTop: '20px',
        }}
      >
        DBから受け取った値を描画する
      </TypoH3>
      <TypoText sx={{ marginTop: '5px' }}>
        ※内容はLaravelのSeederが作成した文字列
      </TypoText>
      <Box
        sx={{
          marginTop: '10px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '5px',
        }}
      >
        {trnUserList.list().map(trnUser => (
          <Facility
            sx={{
              width: 'calc(50% - 5px)',
            }}
            key={trnUser.id}
            trnUser={trnUser}
          />
        ))}
      </Box>
    </Page>
  );
};
