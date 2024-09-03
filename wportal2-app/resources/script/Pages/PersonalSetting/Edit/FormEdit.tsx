import * as React from 'react';
import { Box, FormControl, Grid, TextField } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { LabelValue } from '@/script/Pages/Common/LabelValue';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { InputField } from '@/script/Component/Form/InputField';
import { IFormEditValidationResult } from '@/script/Pages/PersonalSetting/Edit/FormEditValidation';
import {
  DropFile,
  FormEditImageDrop,
} from '@/script/Pages/PersonalSetting/Edit/FormEditImageDrop';
import { InputFieldMultiline } from '@/script/Component/Form/InputFieldMultiline';

export interface IFormEdit {
  name: string;
  nickname: string;
  birthDate: string | null;
  selfIntroduction: string;
  slackUserId: string;
  slackUserName: string;
  slackTeamId: string;
  upload?: DropFile & File;
}

interface IProps extends IPropsBase {
  formEdit: IFormEdit;
  validation: IFormEditValidationResult;
  handleUpdate: (newValues: Partial<IFormEdit>) => void;
  handleSubmit: () => void;
}
export const FormEdit: React.FC<IProps> = ({
  sx,
  formEdit,
  validation,
  handleUpdate,
  handleSubmit,
}) => {
  return (
    <FormControl
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        gap: '20px',
        borderRadius: '16px',
        ...sx,
      }}
    >
      <FormEditImageDrop
        sx={{ width: '100%' }}
        formEdit={formEdit}
        handleUpdate={handleUpdate}
      />
      <LabelValue sx={{ width: '400px' }} label="名前" value={formEdit.name} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'start',
          gap: '20px',
          width: '500px',
        }}
      >
        <TypoText sx={{ minWidth: '150px' }}>表示名</TypoText>
        <InputField
          id="form-personal-setting-nickname"
          inputValue={formEdit.nickname}
          onChange={nickname => handleUpdate({ nickname })}
          visibleError
          errors={validation.data.nickname?.errors}
        />
      </Box>

      {/* 生年月日入力フィールド */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'start',
          gap: '20px',
          width: '500px',
        }}
      >
        <TypoText sx={{ minWidth: '150px' }}>生年月日</TypoText>
        <InputField
          id="form-personal-setting-birth-date"
          inputValue={formEdit.birthDate ?? ''}
          onChange={birthDate => handleUpdate({ birthDate })}
          visibleError
          errors={validation.data.birthDate?.errors}
          type="date"
          inputProps={{
            width: '186px',
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TypoText sx={{ minWidth: '170px' }}>SlackユーザーID</TypoText>
        <InputField
          id="form-personal-setting-slack-user-id"
          inputValue={formEdit.slackUserId}
          onChange={slackUserId => handleUpdate({ slackUserId })}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TypoText sx={{ minWidth: '170px' }}>Slackユーザー名</TypoText>
        <InputField
          id="form-personal-setting-slack-user-name"
          inputValue={formEdit.slackUserName}
          onChange={slackUserName => handleUpdate({ slackUserName })}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TypoText sx={{ minWidth: '170px' }}>SlackチームID</TypoText>
        <InputField
          id="form-personal-setting-slack-team-id"
          inputValue={formEdit.slackTeamId}
          onChange={slackTeamId => handleUpdate({ slackTeamId })}
        />
      </Box>
      {/* 自己紹介入力フォーム */}
      <Box
        sx={{
          display: 'flex',
          gap: '20px',
        }}
      >
        <TypoText sx={{ minWidth: '150px' }}>自己紹介</TypoText>
        <Box>
          <InputFieldMultiline
            sx={{ minWidth: '50%' }}
            id="form-personal-setting-self-introduction"
            inputValue={formEdit.selfIntroduction ?? ''}
            onChange={selfIntroduction => handleUpdate({ selfIntroduction })}
            errors={validation.data.selfIntroduction?.errors}
            placeHolder="自己紹介を入力してください"
            rows={5}
            inputProps={{
              width: '500px',
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          marginLeft: 'auto',
        }}
      >
        <ButtonGeneral
          sx={{
            minWidth: '200px',
            alignItems: 'right',
            marginBottom: '20px',
          }}
          label="更新"
          onClick={handleSubmit}
        />
      </Box>
    </FormControl>
  );
};
