import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { IAppTrnGoodJob } from '@/script/Models/App/Trn/TrnGoodJobList';
import { E_TARGET_TYPE } from '@/script/Enum/Server/App/GoodJob/ETargetType';
import { Avatar } from '@/script/Pages/Common/Avatar';

export const E_TARGET = {
  FROM: 'from',
  TO: 'to',
} as const;
export type ETarget = (typeof E_TARGET)[keyof typeof E_TARGET];

interface IProps extends IPropsBase {
  target: ETarget;
  trnGoodJob: IAppTrnGoodJob;
}
export const GoodJobTarget: React.FC<IProps> = ({ sx, target, trnGoodJob }) => {
  const type =
    target === E_TARGET.FROM
      ? trnGoodJob.fromTargetType
      : trnGoodJob.toTargetType;

  /**
   * 各タイプの表記
   */
  const nodeFrom = (): React.ReactNode => {
    switch (type) {
      case E_TARGET_TYPE.USER:
        return <Avatar />;
      case E_TARGET_TYPE.DIVISION:
        return <Box>課</Box>;
      case E_TARGET_TYPE.PROJECT:
        return <Box>プロジェクト</Box>;
      case E_TARGET_TYPE.LABEL:
        return <Box>ラベル</Box>;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      {nodeFrom()}
    </Box>
  );
};
