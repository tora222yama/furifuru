import * as React from 'react';
import { Box, FormControl } from '@mui/material';
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

export interface IFormEdit {
  name: string;
  nickname: string;
  birthDate: string | null;
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
  console.log('formEdit:', formEdit);
  return (
    <FormControl
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        gap: '20px',
        ...sx,
      }}
    >
      <LabelValue sx={{ width: '400px' }} label="名前" value={formEdit.name} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TypoText sx={{ minWidth: '200px' }}>表示名</TypoText>
        <InputField
          id="form-personal-setting-nickname"
          inputValue={formEdit.nickname}
          onChange={nickname => handleUpdate({ nickname })}
          visibleError
          errors={validation.data.nickname?.errors}
        />

        {/* 生年月日入力フィールド */}
        <TypoText sx={{ minWidth: '90px', marginLeft: '90px' }}>
          生年月日
        </TypoText>
        <InputField
          id="form-personal-setting-birth-date"
          inputValue={formEdit.birthDate ?? ''}
          onChange={birthDate => handleUpdate({ birthDate })}
          visibleError
          errors={validation.data.birthDate?.errors}
          type="date"
        />
      </Box>
      <FormEditImageDrop
        sx={{ width: '100%' }}
        formEdit={formEdit}
        handleUpdate={handleUpdate}
      />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TypoText sx={{ minWidth: '200px' }}>SlackユーザーID</TypoText>
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
        <TypoText sx={{ minWidth: '200px' }}>Slackユーザー名</TypoText>
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
        <TypoText sx={{ minWidth: '200px' }}>SlackチームID</TypoText>
        <InputField
          id="form-personal-setting-slack-team-id"
          inputValue={formEdit.slackTeamId}
          onChange={slackTeamId => handleUpdate({ slackTeamId })}
        />
      </Box>
      <ButtonGeneral
        sx={{
          minWidth: '200px',
        }}
        label="更新"
        onClick={handleSubmit}
      />
    </FormControl>
  );
};
