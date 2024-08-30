import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';

interface IProps extends IPropsBase {
  handleComplete: () => void;
}
export const ContentComplete: React.FC<IProps> = ({ handleComplete }) => {
  return (
    <>
      <TypoText bold>Step 1/3</TypoText>
      <TypoText sx={{ marginTop: '10px' }}>
        Authenticatorの設定が完了しました
      </TypoText>
      <ButtonGeneral
        sx={{ marginTop: '10px' }}
        label="閉じる"
        onClick={handleComplete}
      />
    </>
  );
};
