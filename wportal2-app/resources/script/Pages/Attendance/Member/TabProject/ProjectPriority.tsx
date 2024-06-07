import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { IAppTrnProject } from '@/script/Models/App/Trn/TrnProjectList';
import { E_ICON, EIcon } from '@/script/Enum/EIcon';
import { Icon } from '@/script/Component/Misc/Icon';
import { Log } from '@/script/Common/Log';

interface IStar {
  priority: number;
  icon: EIcon;
}

interface IProps extends IPropsBase {
  trnProject: IAppTrnProject;
}
export const ProjectPriority: React.FC<IProps> = ({ sx, trnProject }) => {
  // 表示する星情報.
  const starList: IStar[] = React.useMemo(() => {
    const maxStar = 5;
    const currentStar = trnProject.trnUserProjectPriority?.length
      ? trnProject.trnUserProjectPriority[0].projectPriority
      : 1;
    const ret: IStar[] = [];
    for (let i = 1; i <= maxStar; ++i) {
      ret.push({
        priority: i,
        icon: i <= currentStar ? E_ICON.STAR : E_ICON.STAR_OUTLINE,
      });
    }

    return ret;
  }, [trnProject]);

  /**
   * 星を選択した時.
   */
  const handleClickStar = (_star: IStar) => {
    Log.info('プロジェクトの優先度を変更する.');
  };

  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      {starList.map(star => {
        return (
          <Icon
            sx={{
              color: '#F5CD3B',
              cursor: 'pointer',
            }}
            key={star.priority}
            icon={star.icon}
            size="32px"
            onClick={() => handleClickStar(star)}
          />
        );
      })}
    </Box>
  );
};
