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
import {
  AppTrnProjectList,
  IAppTrnProject,
  parseAppTrnProjectPayload,
} from '@/script/Models/App/Trn/TrnProjectList';
import {
  AppTrnUserList,
  IAppTrnUser,
  parseAppTrnUserPayload,
} from '@/script/Models/App/Trn/TrnUserList';
import { IAttendanceState } from '@/script/Pages/Attendance/IAttendanceState';

/**
 * コントローラーからグローバルに受取保持する値.
 */
type IndexContext = {
  trnAttendanceState: AppTrnAttendanceStateList;
  trnProjectList: AppTrnProjectList;
  trnUserList: AppTrnUserList;
  stateList: IAttendanceState[];
};
export const context = React.createContext<IndexContext>({
  trnAttendanceState: new AppTrnAttendanceStateList(),
  trnProjectList: new AppTrnProjectList(),
  trnUserList: new AppTrnUserList(),
  stateList: [],
});
export const useIndexContext = (): IndexContext => useContext(context);

interface IProps extends IPropsBase {
  trnAttendanceState: IAppTrnAttendanceState[];
  trnProjectList: IAppTrnProject[];
  trnUserList: IAppTrnUser[];
}
export const Index: React.FC<IProps> = ({
  trnAttendanceState,
  trnProjectList,
  trnUserList,
  ...props
}) => {
  /**
   * 下位コンポーネントで利用するコントローラー経由のパラメータ.
   */
  const providerValue: IndexContext = useMemo(() => {
    const appTrnAttendanceStateList = new AppTrnAttendanceStateList(
      trnAttendanceState.map(v => parseAppTrnAttendanceStatePayload(v)),
    );

    return {
      trnAttendanceState: appTrnAttendanceStateList,
      trnProjectList: new AppTrnProjectList(
        trnProjectList.map(v => parseAppTrnProjectPayload(v)),
      ),
      trnUserList: new AppTrnUserList(
        trnUserList.map(v => parseAppTrnUserPayload(v)),
      ),

      // 初回取得時に各ユーザーの出勤状態を一括で取得しておく.
      stateList: trnUserList.map(trnUser => {
        return {
          trnUser,
          isWorking: appTrnAttendanceStateList.isWorking(trnUser.id),
          isRest: appTrnAttendanceStateList.isRest(trnUser.id),
          workingPlace: appTrnAttendanceStateList.lastWorkingPlace(trnUser.id),
          workingState: appTrnAttendanceStateList.lastWorkingState(trnUser.id),
          lastAttendanceState: appTrnAttendanceStateList.lastAttendanceState(
            trnUser.id,
          ),
        };
      }),
    };
  }, [trnAttendanceState, trnProjectList, trnUserList]);

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
