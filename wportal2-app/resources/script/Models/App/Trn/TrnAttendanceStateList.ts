import {
  attendanceToWorking,
  E_ATTENDANCE_STATE,
  EAttendanceState,
} from '@/script/Enum/Server/App/EAttendanceState';
import { ListBase } from '@/script/Models/ListBase';
import {
  E_WORKING_STATE,
  EWorkingState,
} from '@/script/Enum/Server/App/EWorkingState';

export interface IAppTrnAttendanceState {
  id: number;
  trnUserId: number;
  eAttendanceState: EAttendanceState;
}

export const parseAppTrnAttendanceStatePayload = (
  payload: IAppTrnAttendanceState,
): IAppTrnAttendanceState => {
  return {
    id: payload.id ? Number(payload.id) : 0,
    trnUserId: payload.trnUserId ? Number(payload.trnUserId) : 0,
    eAttendanceState: payload.eAttendanceState
      ? (Number(payload.eAttendanceState) as EAttendanceState)
      : E_ATTENDANCE_STATE.INVALID,
  };
};

export class AppTrnAttendanceStateList extends ListBase<IAppTrnAttendanceState> {
  constructor(data: IAppTrnAttendanceState[] = []) {
    super(data);
  }

  static defaultInterface(): IAppTrnAttendanceState {
    return {
      id: 0,
      trnUserId: 0,
      eAttendanceState: E_ATTENDANCE_STATE.INVALID,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  default = (): IAppTrnAttendanceState => {
    return AppTrnAttendanceStateList.defaultInterface();
  };

  // eslint-disable-next-line class-methods-use-this
  getPrimary(value: IAppTrnAttendanceState): number {
    return value.id;
  }

  /**
   * 指定ユーザーIDの最新の勤務状態を取得.
   */
  public lastWorkingState = (trnUserId?: number): EWorkingState => {
    const reverse = this.reverse();
    const attendanceWithWorking = reverse
      .filter(it => it.trnUserId === trnUserId)
      .find(
        it => attendanceToWorking(it.eAttendanceState) !== E_WORKING_STATE.NONE,
      );
    if (attendanceWithWorking === undefined) {
      return E_WORKING_STATE.NONE;
    }
    return attendanceToWorking(attendanceWithWorking.eAttendanceState);
  };
}
