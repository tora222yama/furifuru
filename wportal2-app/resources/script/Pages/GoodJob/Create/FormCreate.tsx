import * as React from 'react';
import {
  E_TARGET_TYPE,
  ETargetType,
} from '@/script/Enum/Server/App/GoodJob/ETargetType';
import { IPropsBase } from '@/script/System/System';
import { Box } from '@mui/material';
import { responsiveSize, responsiveSpacing } from '@/script/System/Responsive';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { InputField } from '@/script/Component/Form/InputField';
import { InputFieldMultiline } from '@/script/Component/Form/InputFieldMultiline';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';
import {
  IItemNumber,
  SelectItemNumber,
} from '@/script/Component/Form/SelectItemNumber';

export interface IFormCreate {
  fromTargetType: ETargetType;
  fromTrnUserId: number;
  fromTrnDivisionId: number;
  fromTrnProjectId: number;
  fromOtherLabel: string;

  toTargetType: ETargetType;
  toTrnUserId: number;
  toTrnDivisionId: number;
  toTrnProjectId: number;
  toOtherLabel: string;

  title: string;
  content: string;
}
export const defaultInterface: IFormCreate = {
  fromTargetType: E_TARGET_TYPE.USER,
  fromTrnUserId: 0,
  fromTrnDivisionId: 0,
  fromTrnProjectId: 0,
  fromOtherLabel: '',

  toTargetType: E_TARGET_TYPE.USER,
  toTrnUserId: 0,
  toTrnDivisionId: 0,
  toTrnProjectId: 0,
  toOtherLabel: '',

  title: '',
  content: '',
};

interface IProps extends IPropsBase {
  formCreate: IFormCreate;
  handleUpdate: (newValues: Partial<IFormCreate>) => void;
  handleSubmit: () => void;
}
export const FormCreate: React.FC<IProps> = ({
  sx,
  formCreate,
  handleUpdate,
  handleSubmit,
}) => {
  /**
   * 仮作成.
   */
  const selectItemList: IItemNumber[] = [
    { id: Number(E_TARGET_TYPE.USER), label: 'ユーザー' },
    { id: Number(E_TARGET_TYPE.DIVISION), label: '部署' },
    { id: Number(E_TARGET_TYPE.PROJECT), label: 'プロジェクト' },
    { id: Number(E_TARGET_TYPE.LABEL), label: 'その他' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        gap: responsiveSpacing(4),
        ...sx,
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TypoText sx={{ minWidth: responsiveSize(200) }}>送信元</TypoText>
        <SelectItemNumber
          sxSelect={{
            width: responsiveSize(200),
          }}
          value={formCreate.fromTargetType}
          list={selectItemList}
          onChange={value =>
            handleUpdate({ fromTargetType: value as ETargetType })
          }
        />
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TypoText sx={{ minWidth: responsiveSize(200) }}>送信先</TypoText>
        <SelectItemNumber
          sxSelect={{
            width: responsiveSize(200),
          }}
          value={formCreate.toTargetType}
          list={selectItemList}
          onChange={value =>
            handleUpdate({ toTargetType: value as ETargetType })
          }
        />
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TypoText sx={{ minWidth: responsiveSize(200) }}>タイトル</TypoText>
        <InputField
          id="form-good-job-create-title"
          sx={{
            width: '100%',
          }}
          fieldSx={{
            width: '100%',
          }}
          inputValue={formCreate.title}
          onChange={title => handleUpdate({ title })}
          visibleError
          //errors={validation.data.name?.errors}
        />
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TypoText sx={{ minWidth: responsiveSize(200) }}>内容</TypoText>
        <InputFieldMultiline
          id="form-good-job-create-content"
          sx={{
            width: '100%',
          }}
          fieldSx={{
            width: '100%',
          }}
          inputProps={{
            sx: {
              resize: 'vertical',
            },
          }}
          rows={8}
          inputValue={formCreate.content}
          onChange={content => handleUpdate({ content })}
          visibleError
          //errors={validation.data.name?.errors}
        />
      </Box>
      <ButtonGeneral
        sx={{
          marginLeft: 'auto',
          minWidth: responsiveSize(200),
        }}
        label="登録"
        onClick={handleSubmit}
      />
    </Box>
  );
};
