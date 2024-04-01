import * as React from 'react';
import { FormControl } from '@mui/material';
import { IPropsBase } from '@/js/System/System';
import { InputField } from '@/js/Component/Form/InputField';
import { ButtonGeneral } from '@/js/Component/Button/ButtonGeneral';
import { E_BUTTON_TYPE } from '@/js/Component/Button/EButtonType';

export interface IFormRedis {
  storeValue: string;
}

interface IProps extends IPropsBase {
  loading: boolean;
  formRedis: IFormRedis;
  handleUpdate: (newValues: Partial<IFormRedis>) => void;
  handleSaveGraphQL: () => void;
  handleSavePost: () => void;
}
export const FormRedis: React.FC<IProps> = ({
  sx,
  loading,
  formRedis,
  handleUpdate,
  handleSaveGraphQL,
  handleSavePost,
}) => {
  return (
    <FormControl
      sx={{
        ...sx,
      }}
    >
      <InputField
        inputValue={formRedis.storeValue}
        onChange={storeValue => handleUpdate({ storeValue })}
        placeHolder="入力してください"
      />
      <ButtonGeneral
        sx={{
          marginTop: '20px',
        }}
        buttonType={E_BUTTON_TYPE.PRIMARY}
        onClick={handleSaveGraphQL}
        label="GraphQLで保存"
        disabled={loading}
      />
      <ButtonGeneral
        sx={{
          marginTop: '10px',
        }}
        buttonType={E_BUTTON_TYPE.PRIMARY}
        onClick={handleSavePost}
        label="Post通信で保存"
        disabled={loading}
      />
    </FormControl>
  );
};
