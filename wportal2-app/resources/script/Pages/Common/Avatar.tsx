import * as React from 'react';
import { Box, Chip, Avatar as MuiAvatar } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { IAppTrnUser } from '@/script/Models/App/Trn/TrnUserList';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { getAuthorizedImagePath } from '@/script/Common/Image';
import { E_COLOR } from '@/script/Enum/EColor';

interface IProps extends IPropsBase {
  trnUser?: IAppTrnUser;
}
export const Avatar: React.FC<IProps> = ({ sx, trnUser }) => {
  /**
   * 画像表示.
   */
  const nodeAvatar = () => {
    return (
      <MuiAvatar
        alt={trnUser?.nickname}
        src={getAuthorizedImagePath(trnUser?.faceImagePath)}
      />
    );
  };

  /**
   * 名前表示.
   */
  const nodeLabel = (): React.ReactNode => {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TypoText>{trnUser?.nickname}</TypoText>
      </Box>
    );
  };

  return (
    <Chip
      sx={{
        backgroundColor: E_COLOR.GREEN_LIGHT,
        ...sx,
      }}
      avatar={nodeAvatar()}
      label={nodeLabel()}
    />
  );
};
