import { ListBase } from '@/script/Models/ListBase';
import {
  IAppTrnProjectUser,
  parseAppTrnProjectUserPayload,
} from '@/script/Models/App/Trn/TrnProjectUserList';

export interface IAppTrnProject {
  id: number;
  name: string;
  explain: string;
  displayOrder: number;

  trnProjectUser?: IAppTrnProjectUser[];
}

export const parseAppTrnProjectPayload = (
  payload: IAppTrnProject,
): IAppTrnProject => {
  return {
    id: payload.id ? Number(payload.id) : 0,
    name: payload.name ? String(payload.name) : '',
    explain: payload.explain ? String(payload.explain) : '',
    displayOrder: payload.displayOrder ? Number(payload.displayOrder) : 0,

    trnProjectUser: payload.trnProjectUser
      ? payload.trnProjectUser.map(trnProjectUser =>
          parseAppTrnProjectUserPayload(trnProjectUser),
        )
      : [],
  };
};

export class AppTrnProjectList extends ListBase<IAppTrnProject> {
  constructor(data: IAppTrnProject[] = []) {
    super(data);
  }

  static defaultInterface(): IAppTrnProject {
    return {
      id: 0,
      name: '',
      explain: '',
      displayOrder: 0,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  default = (): IAppTrnProject => {
    return AppTrnProjectList.defaultInterface();
  };

  // eslint-disable-next-line class-methods-use-this
  getPrimary(value: IAppTrnProject): number {
    return value.id;
  }
}
