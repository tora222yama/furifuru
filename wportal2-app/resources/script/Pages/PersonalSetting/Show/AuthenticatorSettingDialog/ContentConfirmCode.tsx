import * as React from 'react';
import { Box } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import { IPropsBase } from '@/script/System/System';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { E_COLOR } from '@/script/Enum/EColor';
import { ButtonGeneral } from '@/script/Component/Button/ButtonGeneral';
import { useMutationAppPersonalSettingSpConfirmCode } from '@/script/Hooks/App/Mutations/useMutationAppPersonalSettingSPConfirmCode';
import { useProgressContext } from '@/script/Provider/ProgressProvider';
import { E_STATUS_CODE } from '@/script/Enum/Server/App/EStatusCode';
import { InputField } from '@/script/Component/Form/InputField';

export interface IFormCode {
  code: string;
}

interface IProps extends IPropsBase {
  url: string;
  handleClose: () => void;
  handleComplete: () => void;
}
export const ContentConfirmCode: React.FC<IProps> = ({
  url,
  handleClose,
  handleComplete,
}) => {
  const { onStart, onFinish } = useProgressContext();
  const [formCode, setFormCode] = React.useState<IFormCode>({
    code: '',
  });
  const [, mutationConfirmCode] = useMutationAppPersonalSettingSpConfirmCode();

  /**
   * 2FAコードの送信.
   */
  const handleSubmitCode = () => {
    onStart();
    mutationConfirmCode({ code: formCode.code }, []).then(result => {
      switch (result.statusCode) {
        case E_STATUS_CODE.OK:
          handleComplete();
          break;
        default:
          break;
      }
      onFinish();
    });
  };

  return (
    <>
      <TypoText bold>Step 2/3</TypoText>
      <TypoText sx={{ marginTop: '10px' }}>
        下記QRを「Google
        Authenticator」で読み取り、表示されたコードを入力してください。
      </TypoText>
      <Box
        sx={{
          width: 'fit-content',
          border: `1px solid ${E_COLOR.TEXT_PRIMARY}`,
          margin: '10px',
          padding: '5px 5px 0px',
        }}
      >
        <QRCodeCanvas value={url} />
      </Box>
      <Box
        sx={{
          margin: '20px 0px 20px',
          display: 'flex',
          alignItems: 'center',
        }}
        component="form"
      >
        <TypoText sx={{ width: '200px' }}>6桁のコード</TypoText>
        <InputField
          inputValue={formCode.code}
          onChange={code => setFormCode({ code })}
          visibleError
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <ButtonGeneral label="キャンセル" onClick={handleClose} />
        <ButtonGeneral label="送信する" onClick={handleSubmitCode} />
      </Box>
    </>
  );
};
