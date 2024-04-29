import { ListBase } from '@/script/Models/ListBase';

export interface IAppTrnUser {
  id: number;
  authId: number;
  nickname: string;
  faceImagePath: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseAppTrnUserPayload = (payload: any): IAppTrnUser => {
  return {
    id: payload?.id ? Number(payload.id) : 0,
    authId: payload?.authId ? Number(payload.authId) : 0,
    nickname: payload?.nickname ? String(payload.nickname) : '',
    faceImagePath: payload?.faceImagePath ? String(payload.faceImagePath) : '',
  };
};

export class AppTrnUserList extends ListBase<IAppTrnUser> {
  constructor(data: IAppTrnUser[] = []) {
    super(data);
  }

  static defaultInterface(): IAppTrnUser {
    return {
      id: 0,
      authId: 0,
      nickname: '',
      faceImagePath: '',
    };
  }

  // eslint-disable-next-line class-methods-use-this
  default = (): IAppTrnUser => {
    return AppTrnUserList.defaultInterface();
  };

  // eslint-disable-next-line class-methods-use-this
  getPrimary(value: IAppTrnUser): number {
    return value.id;
  }
}
