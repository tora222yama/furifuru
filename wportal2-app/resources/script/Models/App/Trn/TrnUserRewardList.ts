import { ListBase } from '@/script/Models/ListBase';
import {
  IAppMstReward,
  parseAppMstRewardPayload,
} from '@/script/Models/App/Mst/MstReward';

export interface IAppTrnUserReward {
  id: number;
  trnUserId: number;
  mstRewardId: number;
  achievementCount: number;
  receivedCount: number;
  createdAt: string;
  updatedAt: string;

  mstReward?: IAppMstReward;
}

export const parseAppTrnUserRewardPayload = (
  payload?: IAppTrnUserReward,
): IAppTrnUserReward => {
  return {
    id: payload?.id ? Number(payload.id) : 0,
    trnUserId: payload?.trnUserId ? Number(payload.trnUserId) : 0,
    mstRewardId: payload?.mstRewardId ? Number(payload.mstRewardId) : 0,
    achievementCount: payload?.achievementCount
      ? Number(payload.achievementCount)
      : 0,
    receivedCount: payload?.receivedCount ? Number(payload.receivedCount) : 0,
    createdAt: payload?.createdAt ? String(payload.createdAt) : '',
    updatedAt: payload?.updatedAt ? String(payload.updatedAt) : '',

    mstReward: payload?.mstReward
      ? parseAppMstRewardPayload(payload.mstReward)
      : undefined,
  };
};

export class AppTrnUserRewardList extends ListBase<IAppTrnUserReward> {
  constructor(data: IAppTrnUserReward[] = []) {
    super(data);
  }

  static defaultInterface(): IAppTrnUserReward {
    return {
      id: 0,
      trnUserId: 0,
      mstRewardId: 0,
      achievementCount: 0,
      receivedCount: 0,
      createdAt: '',
      updatedAt: '',
    };
  }

  // eslint-disable-next-line class-methods-use-this
  default = (): IAppTrnUserReward => {
    return AppTrnUserRewardList.defaultInterface();
  };

  // eslint-disable-next-line class-methods-use-this
  getPrimary(value: IAppTrnUserReward): number {
    return value.id;
  }
}
