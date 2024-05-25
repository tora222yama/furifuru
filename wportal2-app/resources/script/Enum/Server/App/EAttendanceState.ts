import {
  E_WORKING_STATE,
  EWorkingState,
} from '@/script/Enum/Server/App/EWorkingState';

// #ENUM_DEFINE_START#
/**
 * 出退勤ステータス
 * @note 値の変更禁止.
 */
export const E_ATTENDANCE_STATE = {
  INVALID: 0, // 無効
  ATTENDANCE_OFFICE: 10001, // 出勤:オフィス
  ATTENDANCE_TELEWORK: 10002, // 出勤:テレワーク
  BEGIN_BREAK: 20001, // 休憩:開始
  END_BREAK: 20002, // 休憩:終了
  SWITCH_TO_OFFICE: 30001, // 切替:オフィスへ
  SWITCH_TO_TELEWORK: 30002, // 切替:テレワークへ
  LEAVING: 40001, // 退勤
} as const;
export type EAttendanceState =
  (typeof E_ATTENDANCE_STATE)[keyof typeof E_ATTENDANCE_STATE];
// #ENUM_DEFINE_END#

/**
 * アクションを勤務状態に変換.
 * @param attendance
 */
export const attendanceToWorking = (
  attendance: EAttendanceState,
): EWorkingState => {
  switch (attendance) {
    case E_ATTENDANCE_STATE.ATTENDANCE_OFFICE:
    case E_ATTENDANCE_STATE.ATTENDANCE_TELEWORK:
    case E_ATTENDANCE_STATE.END_BREAK:
      return E_WORKING_STATE.WORKING;
    case E_ATTENDANCE_STATE.BEGIN_BREAK:
      return E_WORKING_STATE.REST;
    case E_ATTENDANCE_STATE.LEAVING:
      return E_WORKING_STATE.LEAVING;
    case E_ATTENDANCE_STATE.SWITCH_TO_OFFICE:
    case E_ATTENDANCE_STATE.SWITCH_TO_TELEWORK:
    case E_ATTENDANCE_STATE.INVALID:
      return E_WORKING_STATE.NONE;
    default:
      return E_WORKING_STATE.NONE;
  }
};
