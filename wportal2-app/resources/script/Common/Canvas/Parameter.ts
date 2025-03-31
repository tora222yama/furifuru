import { Vector2D } from '@/script/Common/Canvas/Math/Vector2D';
import { IObject } from '@/script/Common/Canvas/Object';

export interface IParameter {
  scale: number;
  offset: Vector2D;
  mouseDownL: boolean;
  mouseOriginL: Vector2D;
  mouseDownM: boolean;
  mouseOriginM: Vector2D;
  mouseDownR: boolean;
  mouseOriginR: Vector2D;
  prevPosition: Vector2D;
  currentPosition: Vector2D;
  overlayObject: IObject | null;
  captureObject: IObject | null;
}
