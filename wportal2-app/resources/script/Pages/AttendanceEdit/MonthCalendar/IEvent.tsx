import { DateTime } from '@/script/Common/DateTime';

export interface IEvent {
  uid?: number;
  start: DateTime;
  end?: DateTime;
  label?: string;
}
