import { Vector2D } from '@/script/Common/Canvas/Math/Vector2D';

export interface IObject {
  id: number;
  name: string;
  position: Vector2D;
  size: Vector2D;
  color: string;
  zIndex: number;
}

export class CanvasObject {
  private readonly uid: string = '';

  constructor(uid: string) {
    this.uid = uid;
  }

  public getUid(): string {
    return this.uid;
  }
}
