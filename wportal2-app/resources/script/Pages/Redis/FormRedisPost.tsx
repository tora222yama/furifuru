import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { IFormRedis } from '@/script/Pages/Redis/FormRedis';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';
import { E_BUTTON_TYPE } from '@/script/Component/Button/EButtonType';
import { useIndexContext } from '@/script/Provider/IndexProvider';

interface IProps extends IPropsBase {
  loading: boolean;
  formRedis: IFormRedis;
}
export const FormRedisPost: React.FC<IProps> = ({ sx, loading, formRedis }) => {
  const { csrfToken } = useIndexContext();

  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      <form action="/redis_post_result" method="POST">
        <input type="hidden" name="store_value" value={formRedis.storeValue} />
        <input type="hidden" name="_token" value={csrfToken} />
        <ButtonGeneral
          sx={{
            marginTop: '10px',
          }}
          type="submit"
          buttonType={E_BUTTON_TYPE.PRIMARY}
          label="直接のPost通信で保存"
          disabled={loading}
        />
      </form>
    </Box>
  );
};
