import { ListBase } from '@/script/Models/ListBase';

export interface IUsecasesCalendarUserSchedule {
  id: string;
  calendarId: string;
  kind: string;
  summary: string;
  start: string;
  end: string;
}

export const parseUsecasesCalendarUserSchedulePayload = (
  payload?: IUsecasesCalendarUserSchedule,
): IUsecasesCalendarUserSchedule => {
  return {
    id: payload?.id ? String(payload.id) : '',
    calendarId: payload?.calendarId ? String(payload.calendarId) : '',
    kind: payload?.kind ? String(payload.kind) : '',
    summary: payload?.summary ? String(payload.summary) : '',
    start: payload?.start ? String(payload.start) : '',
    end: payload?.end ? String(payload.end) : '',
  };
};

export class UseCasesCalendarUserScheduleList extends ListBase<IUsecasesCalendarUserSchedule> {
  constructor(data: IUsecasesCalendarUserSchedule[] = []) {
    super(data);
  }

  static defaultInterface(): IUsecasesCalendarUserSchedule {
    return {
      id: '',
      calendarId: '',
      kind: '',
      summary: '',
      start: '',
      end: '',
    };
  }

  // eslint-disable-next-line class-methods-use-this
  default = (): IUsecasesCalendarUserSchedule => {
    return UseCasesCalendarUserScheduleList.defaultInterface();
  };

  // eslint-disable-next-line class-methods-use-this
  getPrimary(value: IUsecasesCalendarUserSchedule): string {
    return value.id;
  }
}
