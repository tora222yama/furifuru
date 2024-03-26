import * as React from 'react';
import { IPropsBase } from '@/js/System/System';
import { HealthCheck } from '@/js/Pages/HealthCheck/HealthCheck';

/**
 * コントローラーから受け取るprops.
 */
interface IPros extends IPropsBase {}
export const HealthCheckIndex: React.FC<IPros> = () => {
  return <HealthCheck />;
};
export default HealthCheckIndex;
