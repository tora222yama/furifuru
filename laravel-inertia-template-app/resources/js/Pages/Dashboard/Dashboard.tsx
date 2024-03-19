import * as React from 'react';
import { IPropsBase } from '@/js/System/System';
import { Drawer } from '@/js/Component/Drawer/Drawer';
import { AppBar } from '@/js/Component/AppBar/AppBar';

interface IPros extends IPropsBase {}
export const Dashboard: React.FC<IPros> = () => {
  return (
    <>
      <AppBar />
      <Drawer />
      dashboard.
    </>
  );
};
