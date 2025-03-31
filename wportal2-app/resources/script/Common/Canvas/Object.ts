import { Vector2D } from '@/script/Common/Canvas/Math/Vector2D';

export interface IObject {
  id: number;
  name: string;
  position: Vector2D;
  size: Vector2D;
  color: string;
  zIndex: number;
}
