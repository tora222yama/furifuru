import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { CommonIndexProvider } from '@/script/Provider/CommonIndexProvider';
import { ShiftSchedule } from '@/script/Pages/ShiftSchedule/ShiftSchedule';

export type ShiftType = 'remote' | 'office' | 'businessTrip' | 'holiday';

/** DB の Google カレンダー反映ステータス（サーバーから渡される値） */
export type CalendarSyncStatus = 'pending' | 'synced' | 'failed';

/** フロントエンド表示用ステータス（未保存・未入力を含む） */
export type DisplaySyncStatus = CalendarSyncStatus | 'unsaved' | 'unregistered';

export type ShiftEntry = {
  date: string;
  type: ShiftType;
  /** DB に保存済みのエントリのみ存在する */
  syncStatus?: CalendarSyncStatus;
};

export type ShiftSyncResult = {
  successes: ShiftEntry[];
  failures: ShiftEntry[];
};

/** 在宅・出社の勤務開始時刻設定。09:00〜11:00 の 30分刻り。 */
export type ShiftStartSettings = {
  officeStartTime: string;
  remoteStartTime: string;
};

export const SHIFT_START_TIME_OPTIONS = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
] as const;

export type ShiftStartTime = (typeof SHIFT_START_TIME_OPTIONS)[number];

/** Inertia コントローラーから渡されるページ層の props 型定義 */
export type ShiftPageProps = {
  shiftEntries?: ShiftEntry[];
  currentMonth?: string;
  startSettings?: ShiftStartSettings;
  shiftSync?: ShiftSyncResult;
  flash?: { status?: string };
};

interface IProps extends IPropsBase, ShiftPageProps {}

export const Index: React.FC<IProps> = ({
  shiftEntries,
  currentMonth,
  startSettings,
  ...props
}) => {
  // noinspection TypeScriptValidateTypes
  return (
    <CommonIndexProvider {...props}>
      <ShiftSchedule
        shiftEntries={shiftEntries}
        currentMonth={currentMonth}
        startSettings={startSettings}
      />
    </CommonIndexProvider>
  );
};
export default Index;
