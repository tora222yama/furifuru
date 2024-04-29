import * as React from 'react';
import { Box, Divider, Menu, MenuItem } from '@mui/material';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import { IPropsBase } from '@/script/System/System';
import { E_COLOR } from '@/script/Enum/EColor';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { InertiaLink } from '@/script/Component/Misc/InertiaLink';
import { useIndexContext } from '@/script/Provider/IndexProvider';

interface IProps extends IPropsBase {}

export const User: React.FC<IProps> = ({ sx }) => {
  const { trnUser } = useIndexContext();
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);

  /**
   * メニューを開く.
   */
  const handleOpenMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchor(event.currentTarget);
  };

  /**
   * メニューを閉じる.
   */
  const handleClose = () => {
    setAnchor(null);
  };

  return (
    <>
      <Box
        sx={{
          width: '250px',
          height: '100%',
          borderLeft: `1px solid ${E_COLOR.WHITE}`,
          borderRight: `1px solid ${E_COLOR.WHITE}`,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          padding: '0px 10px',
          '&:hover': {
            color: E_COLOR.PRIMARY_DARK,
          },

          ...sx,
        }}
        onClick={handleOpenMenu}
      >
        <Box>FACE</Box>
        <TypoText sx={{ marginLeft: 'auto' }}>{trnUser.nickname}</TypoText>
        <ExpandMoreTwoToneIcon sx={{ marginLeft: '10px' }} />
      </Box>
      <Menu
        sx={{
          '& .MuiMenuItem-root': {
            width: '250px',
          },
        }}
        autoFocus={false}
        anchorEl={anchor}
        open={!!anchor}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={handleClose}
      >
        <MenuItem>
          <InertiaLink href="/personal_setting/show">
            <TypoText>個人設定</TypoText>
          </InertiaLink>
        </MenuItem>
        <Divider sx={{ margin: '8px' }} />
        <MenuItem>
          <a
            href="https://docs.google.com/document/d/1lREZOhp2aJOwNavq2go9mXaDuJjsrlwRhroe0te9T2c/edit?usp=sharing"
            target="_blank"
            rel="noreferrer"
          >
            <TypoText>操作の手引き</TypoText>
          </a>
        </MenuItem>
        <MenuItem>
          <a
            href="https://docs.google.com/spreadsheets/d/1wYJkLvmAX-sCdvwzTAAu8vMQ9Gp6SiLFqKRzDIDwHAY/edit?usp=sharing"
            target="_blank"
            rel="noreferrer"
          >
            <TypoText>リリースノート</TypoText>
          </a>
        </MenuItem>
        <Divider sx={{ margin: '8px' }} />
        <MenuItem>
          <InertiaLink href="/logout">
            <TypoText>ログアウト</TypoText>
          </InertiaLink>
        </MenuItem>
      </Menu>
    </>
  );
};
