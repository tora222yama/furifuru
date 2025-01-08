import * as React from 'react';
import { Paper } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { TypoH1 } from '@/script/Component/Typography/TypoH1';
import { E_PAGES, getPagesName } from '@/script/Enum/Server/App/EPages';
import { Page } from '@/script/Pages/Page';
import { BackLink } from '@/script/Pages/Common/BackLink';
import { responsiveSpacing } from '@/script/System/Responsive';
import {
  defaultInterface,
  FormCreate,
  IFormCreate,
} from '@/script/Pages/GoodJob/Create/FormCreate';

interface IProps extends IPropsBase {}
export const Create: React.FC<IProps> = () => {
  const [formCreate, setFormCreate] =
    React.useState<IFormCreate>(defaultInterface);

  /**
   * 値の更新.
   */
  const handleUpdate = React.useCallback(
    (newValues: Partial<IFormCreate>) => {
      setFormCreate(prevState => ({ ...prevState, ...newValues }));
    },
    [setFormCreate],
  );

  /**
   * 値の送信.
   */
  const handleSubmit = () => {};

  return (
    <Page>
      <BackLink current={E_PAGES.GOOD_JOB__CREATE} />
      <TypoH1>{getPagesName(E_PAGES.GOOD_JOB__CREATE)}</TypoH1>
      <Paper
        sx={{
          marginTop: responsiveSpacing(4),
          padding: responsiveSpacing(4),
        }}
      >
        <FormCreate
          formCreate={formCreate}
          handleUpdate={handleUpdate}
          handleSubmit={handleSubmit}
        />
      </Paper>
    </Page>
  );
};
