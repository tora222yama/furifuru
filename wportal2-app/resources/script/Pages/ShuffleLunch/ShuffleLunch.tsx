import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { Page } from '@/script/Pages/Page';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import { E_PAGES, getPagesName } from '@/script/Enum/Server/App/EPages';
import { useIndexContext } from '@/script/Pages/ShuffleLunch/Index';
import { E_TIME_ZONE } from '@/script/Enum/Server/App/ShuffleLunch/ETimeZone';
import { StandBy } from '@/script/Pages/ShuffleLunch/StandBy/StandBy';
import { DateTime } from '@/script/Common/DateTime';

interface IProps extends IPropsBase {}
export const ShuffleLunch: React.FC<IProps> = () => {
  const { timezone } = useIndexContext();

  /**
   * コンテンツ表示.
   */
  const nodeContent = (): React.ReactNode => {
    switch (timezone) {
      case E_TIME_ZONE.STANDBY:
        return <StandBy />;
      default:
        return null;
    }
  };

  return (
    <Page>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <TypoH1>
          {getPagesName(E_PAGES.SHUFFLE_LUNCH)}({DateTime.now().toDateTime()})
        </TypoH1>
      </Box>
      {nodeContent()}
    </Page>
  );
};
