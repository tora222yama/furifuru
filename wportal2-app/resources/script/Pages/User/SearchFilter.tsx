import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { E_COLOR } from '@/script/Enum/EColor';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';
import { E_BUTTON_TYPE } from '@/script/Component/Button/EButtonType';
import { Icon } from '@/script/Component/Misc/Icon';
import { E_ICON } from '@/script/Enum/EIcon';
import { IFormSearch } from '@/script/Pages/User/FormSearch';

interface IProps extends IPropsBase {
  searchValue: IFormSearch;
  handleReset: () => void;
}
export const SearchFilter: React.FC<IProps> = ({
  sx,
  searchValue,
  handleReset,
}) => {
  /**
   * 表示メッセージ.
   */
  const filterMessage = (): string => {
    const values = [];
    if (searchValue.keyword) {
      values.push(`キーワード [${searchValue.keyword}]`);
    }
    if (searchValue.inactiveUserFlag) {
      values.push('非アクティブのみ');
    }

    return `検索条件:${values.join(',')}`;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        border: `1px dashed ${E_COLOR.PRIMARY_DARK}`,
        backgroundColor: E_COLOR.PRIMARY_LIGHT,
        borderRadius: '10px',
        ...sx,
      }}
    >
      <TypoText>{filterMessage()}</TypoText>
      <ButtonGeneral
        sx={{
          borderRadius: '24px',
          width: '48px',
          minWidth: '48px',
          height: '48px',
          padding: '0px',
        }}
        buttonType={E_BUTTON_TYPE.CONTAINED_SECONDARY}
        onClick={handleReset}
      >
        <Icon icon={E_ICON.CLEAR} />
      </ButtonGeneral>
    </Box>
  );
};
