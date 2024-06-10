import * as React from 'react';
import { router } from '@inertiajs/react';
import { Box, IconButton, Paper, Tab, Tabs } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { DateTime } from '@/script/Common/DateTime';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { E_COLOR } from '@/script/Enum/EColor';
import { E_ICON } from '@/script/Enum/EIcon';
import { Icon } from '@/script/Component/Misc/Icon';
import { useProgressContext } from '@/script/Provider/ProgressProvider';
import { TabProject } from '@/script/Pages/Attendance/Member/TabProject/TabProject';
import { TabDivision } from '@/script/Pages/Attendance/Member/TabDivision/TabDivision';
import { TabMember } from '@/script/Pages/Attendance/Member/TabMember/TabMember';

const E_TAB = {
  PROJECT: 0,
  DIVISION: 1,
  MEMBER: 2,
} as const;
type ETab = (typeof E_TAB)[keyof typeof E_TAB];

interface IProps extends IPropsBase {}
export const Member: React.FC<IProps> = ({ sx }) => {
  const { onStart, onFinish } = useProgressContext();
  const [tabIndex, setTabIndex] = React.useState<ETab>(E_TAB.PROJECT);

  /**
   * タブボタン処理.
   */
  const handleChangeTab = (_event: React.SyntheticEvent, newIndex: ETab) => {
    setTabIndex(newIndex);
  };

  /**
   * リロード処理
   */
  const handleReload = () => {
    // 再取得.
    router.reload({
      method: 'post',
      preserveState: true,
      preserveScroll: true,
      onStart,
      onFinish,
    });
  };

  /**
   * 各タブページの表示.
   */
  const nodeTab = (): React.ReactNode => {
    switch (tabIndex) {
      case E_TAB.PROJECT:
        return <TabProject />;
      case E_TAB.DIVISION:
        return <TabDivision />;
      case E_TAB.MEMBER:
        return <TabMember />;
      default:
        return null;
    }
  };

  return (
    <Paper
      sx={{
        padding: '20px',
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Tabs value={tabIndex} onChange={handleChangeTab}>
          <Tab
            sx={{
              width: '140px',
            }}
            label="プロジェクト"
          />
          <Tab
            sx={{
              width: '140px',
            }}
            label="課"
          />
          <Tab
            sx={{
              width: '140px',
            }}
            label="メンバー"
          />
        </Tabs>
        <Box
          sx={{
            marginLeft: '10px',
            display: 'flex',
            alignItems: 'center',
            columnGap: '10px',
          }}
        >
          <IconButton
            sx={{
              padding: '4px',
              border: '1px solid',
              borderColor: 'divider',
            }}
            onClick={handleReload}
          >
            <Icon
              sx={{
                color: E_COLOR.PRIMARY_MAIN,
              }}
              icon={E_ICON.CACHED}
            />
          </IconButton>
          <TypoText>取得日時：{DateTime.now().toDateTime()}</TypoText>
        </Box>
      </Box>
      {nodeTab()}
    </Paper>
  );
};
