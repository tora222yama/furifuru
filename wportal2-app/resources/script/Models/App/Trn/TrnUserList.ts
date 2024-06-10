import { ListBase } from '@/script/Models/ListBase';
import {
  IAppTrnUserSlackProfile,
  parseAppTrnUserSlackProfilePayload,
} from '@/script/Models/App/Trn/TrnUserSlackProfileList';
import {
  IAppTrnAttendanceState,
  parseAppTrnAttendanceStatePayload,
} from '@/script/Models/App/Trn/TrnAttendanceStateList';

export interface IAppTrnUser {
  id: number;
  authId: number;
  nickname: string;
  faceImagePath: string;

  trnAttendanceState?: IAppTrnAttendanceState[];

  trnUserSlackProfile?: IAppTrnUserSlackProfile;
}

export const parseAppTrnUserPayload = (payload?: IAppTrnUser): IAppTrnUser => {
  return {
    id: payload?.id ? Number(payload.id) : 0,
    authId: payload?.authId ? Number(payload.authId) : 0,
    nickname: payload?.nickname ? String(payload.nickname) : '',
    faceImagePath: payload?.faceImagePath ? String(payload.faceImagePath) : '',

    trnAttendanceState: payload?.trnAttendanceState
      ? payload.trnAttendanceState.map(v =>
          parseAppTrnAttendanceStatePayload(v),
        )
      : [],

    trnUserSlackProfile: payload?.trnUserSlackProfile
      ? parseAppTrnUserSlackProfilePayload(payload.trnUserSlackProfile)
      : undefined,
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
