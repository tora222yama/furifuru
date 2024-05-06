import { ListBase } from '@/script/Models/ListBase';
import {
  IAppTrnDivisionUser,
  parseAppTrnDivisionUserPayload,
} from '@/script/Models/App/Trn/TrnDivisionUserList';

export interface IAppTrnDivision {
  id: number;
  name: string;
  explain: string;
  displayOrder: number;

  trnDivisionUser?: IAppTrnDivisionUser[];
}

export const parseAppTrnDivisionPayload = (
  payload: IAppTrnDivision,
): IAppTrnDivision => {
  return {
    id: payload.id ? Number(payload.id) : 0,
    name: payload.name ? String(payload.name) : '',
    explain: payload.explain ? String(payload.explain) : '',
    displayOrder: payload.displayOrder ? Number(payload.displayOrder) : 0,

    trnDivisionUser: payload.trnDivisionUser
      ? payload.trnDivisionUser.map(trnDivisionUser =>
          parseAppTrnDivisionUserPayload(trnDivisionUser),
        )
      : [],
  };
};

export class AppTrnDivisionList extends ListBase<IAppTrnDivision> {
  constructor(data: IAppTrnDivision[] = []) {
    super(data);
  }

  static defaultInterface(): IAppTrnDivision {
    return {
      id: 0,
      name: '',
      explain: '',
      displayOrder: 0,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  default = (): IAppTrnDivision => {
    return AppTrnDivisionList.defaultInterface();
  };

  // eslint-disable-next-line class-methods-use-this
  getPrimary(value: IAppTrnDivision): number {
    return value.id;
  }
}
