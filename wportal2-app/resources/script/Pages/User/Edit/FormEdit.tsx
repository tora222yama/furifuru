import * as React from 'react';
import { Box, Checkbox, FormControl, FormControlLabel } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { Image } from '@/script/Component/Misc/Image';
import { LabelValue } from '@/script/Pages/Common/LabelValue';
import { Icon } from '@/script/Component/Misc/Icon';
import { E_ICON } from '@/script/Enum/EIcon';
import { TypoH2 } from '@/script/Component/Typography/TypoH2';
import { useIndexContext } from '@/script/Pages/User/Edit/Index';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { Closable } from '@/script/Component/Misc/Closable';
import { InputField } from '@/script/Component/Form/InputField';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';

export interface IFormEdit {
  enableLegacyLogin: boolean;
  overwritePassword: string;
}

interface IProps extends IPropsBase {
  formEdit: IFormEdit;
  handleUpdate: (newValues: Partial<IFormEdit>) => void;
  handleSubmit: () => void;
}
export const FormEdit: React.FC<IProps> = ({
  sx,
  formEdit,
  handleUpdate,
  handleSubmit,
}) => {
  const { trnUser } = useIndexContext();

  return (
    <FormControl sx={sx}>
      <Box
        sx={{
          display: 'flex',
          gap: '20px',
        }}
      >
        <Image
          sx={{
            width: '120px',
            height: '120px',
            borderRadius: '24px',
          }}
          src={trnUser.faceImagePath}
        />
        <Box sx={{ width: '100%' }}>
          <LabelValue
            sx={{ marginTop: '10px' }}
            label="名前"
            value={String(trnUser?.authUser?.name)}
          />
          <LabelValue
            sx={{ marginTop: '10px' }}
            label="表示名"
            value={String(trnUser?.nickname)}
          />
          <LabelValue
            sx={{ marginTop: '10px' }}
            label="E-Mail"
            value={String(trnUser?.authUser?.email)}
          />
        </Box>
      </Box>
      <Box
        sx={{
          marginTop: '20px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Icon
          sx={{ width: '20px', height: '20px', marginRight: '5px' }}
          icon={E_ICON.BUILD}
        />
        <TypoH2>Slack情報</TypoH2>
      </Box>
      <LabelValue
        sx={{
          marginTop: '10px',
        }}
        label="Slack User ID"
        value={trnUser.trnUserSlackProfile?.slackUserId ?? '設定なし'}
      />
      <LabelValue
        sx={{
          marginTop: '10px',
        }}
        label="Slack User Name"
        value={trnUser.trnUserSlackProfile?.slackUserName ?? '設定なし'}
      />
      <LabelValue
        sx={{
          marginTop: '10px',
        }}
        label="Slack Team ID"
        value={trnUser.trnUserSlackProfile?.slackTeamId ?? '設定なし'}
      />
      <Box
        sx={{
          marginTop: '20px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Icon
          sx={{ width: '20px', height: '20px', marginRight: '5px' }}
          icon={E_ICON.BUILD}
        />
        <TypoH2>管理者向け情報</TypoH2>
      </Box>
      <LabelValue
        sx={{
          marginTop: '10px',
        }}
        label="Auth User ID"
        value={String(trnUser.authUser?.id ?? '')}
      />
      <Box
        sx={{
          marginTop: '10px',
          display: 'flex',
        }}
      >
        <TypoText
          sx={{
            marginTop: '10px',
            minWidth: '200px',
            width: '200px',
          }}
        >
          レガシーログインの許可
        </TypoText>
        <Box>
          <Box sx={{ display: 'flex' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formEdit.enableLegacyLogin}
                  onChange={v =>
                    handleUpdate({ enableLegacyLogin: v.target.checked })
                  }
                />
              }
              label={<TypoText>レガシーログインを許可する</TypoText>}
            />
          </Box>
        </Box>
      </Box>
      <Closable open={formEdit.enableLegacyLogin}>
        <Box
          sx={{
            marginTop: '10px',
            display: 'flex',
          }}
        >
          <TypoText
            sx={{
              marginTop: '10px',
              minWidth: '200px',
              width: '200px',
            }}
          >
            上書きパスワード
          </TypoText>
          <InputField
            id="form-user-overwrite-password"
            inputValue={formEdit.overwritePassword}
            onChange={overwritePassword => handleUpdate({ overwritePassword })}
          />
        </Box>
      </Closable>
      <ButtonGeneral
        sx={{
          marginTop: '20px',
          minWidth: '200px',
          width: '200px',
        }}
        label="更新"
        onClick={handleSubmit}
      />
    </FormControl>
  );
};
