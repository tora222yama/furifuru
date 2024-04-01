import * as React from 'react';
import { FormHelperText } from '@mui/material';
import { IPropsBase } from '@/js/System/System';
import { TypoText } from '@/js/Component/Typography/TypoText';

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
          <TypoText key={key} noWrap={noWarp}>
            {v}
          </TypoText>
        );
      })}
    </FormHelperText>
  );
};
