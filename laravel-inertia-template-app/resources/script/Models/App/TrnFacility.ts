// TODO:モデル宣言にして、初期宣言もあった方が良さそう

export interface ITrnFacility {
  id: number;
  categoryId: number;
  name: string;
  explain: string;
  createdAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parsePayload = (payload: any): ITrnFacility => {
  return {
    id: payload.id ? Number(payload.id) : 0,
    categoryId: payload.category_id ? Number(payload.category_id) : 0,
    name: payload.name ? String(payload.name) : '',
    explain: payload.explain ? String(payload.explain) : '',
    createdAt: payload.created_at ? String(payload.created_at) : '',
  };
};
