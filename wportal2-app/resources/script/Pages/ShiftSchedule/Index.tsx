import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { CommonIndexProvider } from '@/script/Provider/CommonIndexProvider';
import { ShiftSchedule } from '@/script/Pages/ShiftSchedule/ShiftSchedule';

export type ShiftType = 'remote' | 'office' | 'businessTrip' | 'holiday';

/** DB の Google カレンダー同期ステータス（サーバーから渡される値） */
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

/** Inertia コントローラーから渡されるページ層の props 型定義 */
export type ShiftPageProps = {
  shiftEntries?: ShiftEntry[];
  currentMonth?: string;
  shiftSync?: ShiftSyncResult;
  flash?: { status?: string };
};

interface IProps extends IPropsBase, ShiftPageProps {}

export const Index: React.FC<IProps> = ({
  shiftEntries,
  currentMonth,
  ...props
}) => {
  // noinspection TypeScriptValidateTypes
  return (
    <CommonIndexProvider {...props}>
      <ShiftSchedule shiftEntries={shiftEntries} currentMonth={currentMonth} />
    </CommonIndexProvider>
  );
};
export default Index;
