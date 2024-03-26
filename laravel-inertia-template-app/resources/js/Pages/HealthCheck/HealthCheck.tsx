import * as React from 'react';
import { IPropsBase } from '@/js/System/System';

interface IPros extends IPropsBase {}
export const HealthCheck: React.FC<IPros> = () => {
  return <>OK</>;
};
