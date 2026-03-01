import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { CommonIndexProvider } from '@/script/Provider/CommonIndexProvider';
import { ShiftSchedule } from '@/script/Pages/ShiftSchedule/ShiftSchedule';

/**
 * コントローラーからグローバルに受取保持する値.
 */
type IndexContext = {
  testProps?: string;
  shiftEntries?: ShiftEntry[];
  currentMonth?: string;
};
export const context = React.createContext<IndexContext>({
  testProps: undefined,
  shiftEntries: undefined,
  currentMonth: undefined,
});

export const useIndexContext = (): IndexContext => React.useContext(context);

type ShiftEntry = {
  date: string;
  type: string;
};

interface IProps extends IPropsBase {
  testProps?: string;
  shiftEntries?: ShiftEntry[];
  currentMonth?: string;
}
export const Index: React.FC<IProps> = ({
  testProps,
  shiftEntries,
  currentMonth,
  ...props
}) => {
  /**
   * 下位コンポーネントで利用するコントローラー経由のパラメータ.
   */
  const providerValue: IndexContext = React.useMemo(
    () => ({
      testProps: testProps,
      shiftEntries: shiftEntries,
      currentMonth: currentMonth,
    }),
    [testProps, shiftEntries, currentMonth],
  );
  console.log(providerValue);
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
