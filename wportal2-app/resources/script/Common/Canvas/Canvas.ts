import { Vector2D } from '@/script/Common/Canvas/Math/Vector2D';

export class Canvas {
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private size: Vector2D = Vector2D.ZERO;
  private initialized = false;

  /**
   * キャンバスの初期化を実施.
   */
  public init(
    canvas: HTMLCanvasElement | null,
    width: number,
    height: number,
  ): Canvas {
    if (this.initialized || !canvas) {
      return this;
    }

    // エレメントを保持.
    this.canvas = canvas;

    // コンテキストを保持.
    this.context = canvas.getContext('2d');

    // サイズを保持.
    this.size = new Vector2D(width, height);

    this.initialized = true;

    return this;
  }

  /**
   * キャンバスサイズを変更した新規インスタンスを得る.
   */
  public resizeInstance(width: number, height: number): Canvas {
    return this.clone().setSize(width, height);
  }

  /**
   * 新規インスタンスを獲得.
   */
  private clone(): Canvas {
    return new Canvas().init(this.canvas, this.size.x, this.size.y);
  }

  /**
   * コンテキストの取得.
   */
  public getContext(): CanvasRenderingContext2D {
    return this.context ?? new CanvasRenderingContext2D();
  }

  /**
   * サイズの取得.
   */
  public getSize(): Vector2D {
    return this.size ?? Vector2D.ZERO;
  }

  /**
   * キャンバスサイズを変更.
   */
  public setSize(width: number, height: number): Canvas {
    this.size.x = width;
    this.size.y = height;
    return this;
  }
}
