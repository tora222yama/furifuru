import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { CommonIndexProvider } from '@/script/Provider/CommonIndexProvider';
import { ShiftSchedule } from '@/script/Pages/ShiftSchedule/ShiftSchedule';

/**
 * コントローラーからグローバルに受取保持する値.
 */
type IndexContext = {
  testProps?: string;
};
export const context = React.createContext<IndexContext>({
  testProps: undefined,
});

export const useIndexContext = (): IndexContext => React.useContext(context);

interface IProps extends IPropsBase {
  testProps?: string;
}
export const Index: React.FC<IProps> = ({ testProps, ...props }) => {
  /**
   * 下位コンポーネントで利用するコントローラー経由のパラメータ.
   */
  const providerValue: IndexContext = React.useMemo(
    () => ({
      testProps: testProps,
    }),
    [testProps],
  );
  // noinspection TypeScriptValidateTypes
  return (
    <CommonIndexProvider {...props}>
      <context.Provider value={providerValue}>
        <ShiftSchedule />
      </context.Provider>
    </CommonIndexProvider>
  );
};
export default Index;
