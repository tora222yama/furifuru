import * as React from 'react';
import { Box, Paper } from '@mui/material';
import { router } from '@inertiajs/react';
import { IPropsBase } from '@/script/System/System';
import { Page } from '@/script/Pages/Page';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import {
  E_PAGES,
  getPagesHref,
  getPagesName,
} from '@/script/Enum/Server/App/EPages';
import {
  FormCommand,
  IFormCommand,
} from '@/script/Pages/Admin/Command/FormCommand';
import { useProgressContext } from '@/script/Provider/ProgressProvider';

interface IProps extends IPropsBase {}
export const Show: React.FC<IProps> = () => {
  const { onStart, onFinish } = useProgressContext();
  const [formCommand, setFormCommand] = React.useState<IFormCommand>({
    command: '',
    output: '',
  });

  /**
   * 値の更新.
   */
  const handleUpdate = React.useCallback(
    (newValues: Partial<IFormCommand>) => {
      setFormCommand(prevState => ({ ...prevState, ...newValues }));
    },
    [setFormCommand],
  );

  /**
   * 値の送信.
   */
  const handleSubmit = () => {
    // TODO: バリデーション.

    router.visit(getPagesHref(E_PAGES.ADMIN__COMMAND__UPDATE), {
      method: 'post',
      preserveState: true,
      replace: true,
      onStart,
      onFinish,
      data: {
        command: formCommand.command,
      },
    });
  };

  return (
    <Page>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <TypoH1>{getPagesName(E_PAGES.ADMIN__COMMAND)}</TypoH1>
      </Box>
      <Paper
        sx={{
          marginTop: '20px',
          padding: '20px',
        }}
      >
        <FormCommand
          formCommand={formCommand}
          handleUpdate={handleUpdate}
          handleSubmit={handleSubmit}
        />
      </Paper>
    </Page>
  );
};
