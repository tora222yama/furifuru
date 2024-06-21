import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { IFormEdit } from '@/script/Pages/Project/Edit/FormEdit';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';
import { Icon } from '@/script/Component/Misc/Icon';
import { E_ICON } from '@/script/Enum/EIcon';
import {
  AppTrnProjectNotificationList,
  IAppTrnProjectNotification,
} from '@/script/Models/App/Trn/TrnProjectNotification';

interface IProps extends IPropsBase {
  formEdit: IFormEdit;
  onChange: (notificationList: IAppTrnProjectNotification[]) => void;
}
export const SlackNotification: React.FC<IProps> = ({
  sx,
  formEdit,
  onChange,
}) => {
  /**
   * フィールド追加が実行された.
   */
  const handleAdd = () => {
    const newList = formEdit.notificationList;
    const newId =
      newList.length === 0 ? 1 : Math.max(...newList.map(v => v.id)) + 1;
    newList.push({
      ...AppTrnProjectNotificationList.defaultInterface(),
      id: newId,
    });
    onChange(newList);
  };

  /**
   * リストに一件も存在しないとき.
   */
  if (!formEdit.notificationList.length) {
    return (
      <Box sx={sx}>
        <Box
          sx={{
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <TypoText>新規登録</TypoText>
          <ButtonGeneral
            sx={{
              minWidth: '48px',
              width: '48px',
              minHeight: '48px',
              height: '48px',
              borderRadius: '24px',
            }}
            onClick={handleAdd}
          >
            <Icon icon={E_ICON.STAR} />
          </ButtonGeneral>
        </Box>
      </Box>
    );
  }

  return <Box sx={sx}>リスト表示.</Box>;
};
