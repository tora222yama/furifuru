import * as React from 'react';
import { Box } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { Page } from '@/script/Pages/Page';
import { useIndexContext } from '@/script/Pages/ShiftSchedule/Index';
// import {
//   E_PAGES,
//   getPagesHref,
//   getPagesName,
// } from '@/script/Enum/Server/App/EPages';

interface IProps extends IPropsBase {}
export const ShiftSchedule: React.FC<IProps> = () => {
  const { testProps } = useIndexContext();

  return (
    <Page>
      <Box>シフト管理</Box>
      <Box>{testProps}</Box>
    </Page>
  );
};
