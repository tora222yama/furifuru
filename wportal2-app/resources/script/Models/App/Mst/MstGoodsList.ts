import { ListBase } from '@/script/Models/ListBase';

export interface IAppMstGoods {
  id: number;
  name: string;
  explain: string;
  comment: string;
  category: string;
  imagePath: string;
  price: number;
}

export const parseAppMstGoodsPayload = (
  payload: IAppMstGoods,
): IAppMstGoods => {
  return {
    id: payload?.id ? Number(payload.id) : 0,
    name: payload?.name ? String(payload.name) : '',
    explain: payload?.explain ? String(payload.explain) : '',
    comment: payload?.comment ? String(payload.comment) : '',
    category: payload?.category ? String(payload.category) : '',
    imagePath: payload?.imagePath ? String(payload.imagePath) : '',
    price: payload?.price ? Number(payload.price) : 0,
  };
};

export class AppMstGoodsList extends ListBase<IAppMstGoods> {
  constructor(data: IAppMstGoods[] = []) {
    super(data);
  }

  static defaultInterface(): IAppMstGoods {
    return {
      id: 0,
      name: '',
      explain: '',
      comment: '',
      category: '',
      imagePath: '',
      price: 0,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  default = (): IAppMstGoods => {
    return AppMstGoodsList.defaultInterface();
  };

  // eslint-disable-next-line class-methods-use-this
  getPrimary(value: IAppMstGoods): number {
    return value.id;
  }
}
