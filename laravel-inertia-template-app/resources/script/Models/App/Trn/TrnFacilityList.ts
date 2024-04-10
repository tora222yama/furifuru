import { ListBase } from '@/script/Models/ListBase';

export interface IAppTrnFacility {
  id: number;
  categoryId: number;
  name: string;
  explain: string;
  createdAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parsePayload = (payload: any): IAppTrnFacility => {
  return {
    id: payload.id ? Number(payload.id) : 0,
    categoryId: payload.category_id ? Number(payload.category_id) : 0,
    name: payload.name ? String(payload.name) : '',
    explain: payload.explain ? String(payload.explain) : '',
    createdAt: payload.created_at ? String(payload.created_at) : '',
  };
};

export class AppTrnFacilityList extends ListBase<IAppTrnFacility> {
  constructor(data: IAppTrnFacility[] = []) {
    super(data);
  }

  static defaultInterface(): IAppTrnFacility {
    return {
      id: 0,
      categoryId: 0,
      name: '',
      explain: '',
      createdAt: '',
    };
  }

  // eslint-disable-next-line class-methods-use-this
  default = (): IAppTrnFacility => {
    return AppTrnFacilityList.defaultInterface();
  };

  // eslint-disable-next-line class-methods-use-this
  getPrimary(value: IAppTrnFacility): number {
    return value.id;
  }
}
