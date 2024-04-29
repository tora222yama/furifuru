import { ListBase } from '@/script/Models/ListBase';

export interface IAppAuthUser {
  id: number;
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseAppAuthUserPayload = (payload: any): IAppAuthUser => {
  return {
    id: payload?.id ? Number(payload.id) : 0,
    name: payload?.name ? String(payload.name) : '',
  };
};

export class AppAuthUserList extends ListBase<IAppAuthUser> {
  constructor(data: IAppAuthUser[] = []) {
    super(data);
  }

  static defaultInterface(): IAppAuthUser {
    return {
      id: 0,
      name: '',
    };
  }

  // eslint-disable-next-line class-methods-use-this
  default = (): IAppAuthUser => {
    return AppAuthUserList.defaultInterface();
  };

  // eslint-disable-next-line class-methods-use-this
  getPrimary(value: IAppAuthUser): number {
    return value.id;
  }
}
