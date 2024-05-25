import * as React from 'react';
import { useContext, useMemo } from 'react';
import { IPropsBase } from '@/script/System/System';
import { CommonIndexProvider } from '@/script/Provider/CommonIndexProvider';
import { Attendance } from '@/script/Pages/Attendance/Attendance';
import {
  AppTrnAttendanceStateList,
  IAppTrnAttendanceState,
  parseAppTrnAttendanceStatePayload,
} from '@/script/Models/App/Trn/TrnAttendanceStateList';

/**
 * コントローラーからグローバルに受取保持する値.
 */
type IndexContext = {
  trnAttendanceState: AppTrnAttendanceStateList;
};
export const context = React.createContext<IndexContext>({
  trnAttendanceState: new AppTrnAttendanceStateList(),
});
export const useIndexContext = (): IndexContext => useContext(context);

interface IProps extends IPropsBase {
  trnAttendanceState: IAppTrnAttendanceState[];
}
export const Index: React.FC<IProps> = ({ trnAttendanceState, ...props }) => {
  /**
   * 下位コンポーネントで利用するコントローラー経由のパラメータ.
   */
  const providerValue: IndexContext = useMemo(
    () => ({
      trnAttendanceState: new AppTrnAttendanceStateList(
        trnAttendanceState.map(v => parseAppTrnAttendanceStatePayload(v)),
      ),
    }),
    [trnAttendanceState],
  );

  // noinspection TypeScriptValidateTypes
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <CommonIndexProvider {...props}>
      <context.Provider value={providerValue}>
        <Attendance />
      </context.Provider>
    </CommonIndexProvider>
  );
};
export default Index;
