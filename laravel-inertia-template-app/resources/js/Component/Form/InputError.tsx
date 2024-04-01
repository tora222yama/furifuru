import * as React from 'react';
import { FormHelperText } from '@mui/material';
import { IPropsBase } from '@/js/System/System';
import { TypoError } from '@/js/Component/Typography/TypeError';

interface IProps extends IPropsBase {
  errors?: string[];
  noWarp?: boolean;
}
export const InputError: React.FC<IProps> = ({
  sx,
  errors,
  noWarp = false,
}) => {
  return (
    <FormHelperText
      sx={{
        ...sx,
      }}
      component="div"
    >
      {errors?.map((v, index) => {
        const key = `${index}:${v}`;
        return (
          <TypoError key={key} noWrap={noWarp}>
            {v}
          </TypoError>
        );
      })}
    </FormHelperText>
  );
};
