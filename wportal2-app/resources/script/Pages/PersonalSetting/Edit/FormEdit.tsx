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
  slackUserId: string;
  slackUserName: string;
  slackTeamId: string;
  upload?: DropFile & File;
}

interface IProps extends IPropsBase {
  loading: boolean;
  formEdit: IFormEdit;
  validation: IFormEditValidationResult;
  handleUpdate: (newValues: Partial<IFormEdit>) => void;
  handleSubmit: () => void;
}
export const FormEdit: React.FC<IProps> = ({
  sx,
  loading,
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
        disabled={loading}
      />
    </FormControl>
  );
};
