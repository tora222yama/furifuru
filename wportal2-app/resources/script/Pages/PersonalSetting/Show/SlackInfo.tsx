import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { TypoH2 } from '@/script/Component/Typography/TypoH2';
import { LabelValue } from '@/script/Pages/Common/LabelValue';
import { Str } from '@/script/Common/Str';
import { IAppTrnUserSlackProfile } from '@/script/Models/App/Trn/TrnUserSlackProfileList';

interface IProps extends IPropsBase {
  trnUserSlackProfile: IAppTrnUserSlackProfile;
}
export const SlackInfo: React.FC<IProps> = ({ sx, trnUserSlackProfile }) => {
  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      <TypoH2>Slack情報</TypoH2>
      <Box
        sx={{
          width: '400px',
          marginTop: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <LabelValue
          label="Slack User ID"
          value={Str.exceptEmpty(trnUserSlackProfile.slackUserId) ?? '設定なし'}
        />
        <LabelValue
          label="Slack User Name"
          value={
            Str.exceptEmpty(trnUserSlackProfile.slackUserName) ?? '設定なし'
          }
        />
        <LabelValue
          label="Slack Team ID"
          value={Str.exceptEmpty(trnUserSlackProfile.slackTeamId) ?? '設定なし'}
        />
      </Box>
    </Box>
  );
};
