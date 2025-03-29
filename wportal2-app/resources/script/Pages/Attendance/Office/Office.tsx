import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { Box } from '@mui/material';
import { Closable } from '@/script/Component/Misc/Closable';
import { DialogConfirm } from '@/script/Component/Misc/DialogConfirm';

interface IObjectTest {
  id: number;
  name: string;
  position: IVector2D;
  size: IVector2D;
  color: string;
  zIndex: number;
}

/**
 * 基本型.
 */
interface IVector2D {
  x: number;
  y: number;
}
const vectorOrigin: IVector2D = { x: 0, y: 0 };

/**
 * キャンバスに持たせたいパラメータ.
 */
interface ICanvasParameterTest {
  scale: number;
  offset: IVector2D;
  mouseDownL: boolean;
  mouseOriginL: IVector2D;
  mouseDownM: boolean;
  mouseOriginM: IVector2D;
  mouseDownR: boolean;
  mouseOriginR: IVector2D;
  prevPosition: IVector2D;
  currentPosition: IVector2D;
  captureObject: IObjectTest | null;
}

/**
 * マウスのボタン判定.
 */
export const E_MOUSE_BUTTON = {
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2,
} as const;
export type EMouseButton = (typeof E_MOUSE_BUTTON)[keyof typeof E_MOUSE_BUTTON];

interface IProps extends IPropsBase {}
export const Office: React.FC<IProps> = ({ sx }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [canvasParameter, setCanvasParameter] =
    React.useState<ICanvasParameterTest>({
      scale: 1,
      offset: vectorOrigin,
      mouseDownL: false,
      mouseOriginL: vectorOrigin,
      mouseDownM: false,
      mouseOriginM: vectorOrigin,
      mouseDownR: false,
      mouseOriginR: vectorOrigin,
      prevPosition: vectorOrigin,
      currentPosition: vectorOrigin,
      captureObject: null,
    });
  const [canvasWidth, setCanvasWidth] = React.useState<number>(0);

  const objectList: IObjectTest[] = [
    {
      id: 1,
      name: 'Object1',
      position: { x: 0, y: 0 },
      size: { x: 100, y: 100 },
      color: 'red',
      zIndex: 1,
    },
    {
      id: 2,
      name: 'Object2',
      position: { x: 100, y: 50 },
      size: { x: 100, y: 100 },
      color: 'green',
      zIndex: 2,
    },
    {
      id: 3,
      name: 'Object3',
      position: { x: -100, y: -50 },
      size: { x: 100, y: 100 },
      color: 'blue',
      zIndex: 3,
    },
  ];

  /**
   * 初期化処理.
   */
  React.useEffect(() => {
    // キャンバスにホイールイベント登録.
    document
      ?.getElementById('canvas')
      ?.addEventListener('wheel', handleMouseWheel);

    // キャンバスのサイズを画面幅一杯に修正.
    setCanvasWidth(document?.getElementById('wrapper')?.clientWidth ?? 0);
  }, []);

  /**
   * 汎用関数.
   */

  /**
   * オブジェクトのX座標をキャンバスX座標に変換する.
   */
  const convertObject2CanvasX = (ctx: CanvasRenderingContext2D, x: number) => {
    return (
      canvasParameter.offset.x * canvasParameter.scale +
      x * canvasParameter.scale +
      ctx.canvas.width / 2
    );
  };

  /**
   * キャンバスのX座標をオブジェクトX座標に変換する.
   */
  const convertCanvas2ObjectX = (ctx: CanvasRenderingContext2D, x: number) => {
    return (
      (x -
        ctx.canvas.width / 2 -
        canvasParameter.offset.x * canvasParameter.scale) /
      canvasParameter.scale
    );
  };

  /**
   * オブジェクトのY座標をキャンバスY座標に変換する.
   */
  const convertObject2CanvasY = (ctx: CanvasRenderingContext2D, y: number) => {
    return (
      canvasParameter.offset.y * canvasParameter.scale +
      -y * canvasParameter.scale +
      ctx.canvas.height / 2
    );
  };

  /**
   * キャンバスのY座標をオブジェクトのY座標に変換する.
   */
  const convertCanvas2ObjectY = (ctx: CanvasRenderingContext2D, y: number) => {
    return (
      -(
        y -
        ctx.canvas.height / 2 -
        canvasParameter.offset.y * canvasParameter.scale
      ) / canvasParameter.scale
    );
  };

  /**
   * オブジェクトの座標をキャンバス座標に変換する.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const convertObject2Canvas = (
    ctx: CanvasRenderingContext2D,
    pos: IVector2D,
  ) => {
    return {
      x: convertObject2CanvasX(ctx, pos.x),
      y: convertObject2CanvasY(ctx, pos.y),
    };
  };

  /**
   * キャンバスの座標をオブジェクト座標に変換する.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const convertCanvas2Object = (
    ctx: CanvasRenderingContext2D,
    pos: IVector2D,
  ) => {
    return {
      x: convertCanvas2ObjectX(ctx, pos.x),
      y: convertCanvas2ObjectY(ctx, pos.y),
    };
  };

  /**
   * 2点間の距離を得る.
   */
  const distance2D = (a: IVector2D, b: IVector2D) => {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  };

  /**
   * キャンバスの再描画.
   */
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      return;
    }
    const scale = canvasParameter.scale;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    objectList.map(object => {
      ctx.fillStyle = object.color;
      const canvasX =
        convertObject2CanvasX(ctx, object.position.x) -
        (object.size.x / 2) * scale;
      const canvasY =
        convertObject2CanvasY(ctx, object.position.y) -
        (object.size.y / 2) * scale;
      ctx.fillRect(
        canvasX,
        canvasY,
        object.size.x * scale,
        object.size.y * scale,
      );
    });

    ctx.font = '20px serif';
    ctx.fillStyle = 'black';
    ctx.fillText(`Scale:${scale}`, 0, 20);
  }, [canvasWidth, canvasParameter]);

  /**
   * キャンバス操作.
   */

  /**
   * マウスの移動時.
   */
  const handleMouseMove = (e: React.WheelEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    // 何れかのボタンが押されている時.
    if (
      canvasParameter.mouseDownL ||
      canvasParameter.mouseDownM ||
      canvasParameter.mouseDownR
    ) {
      const deltaX = pos.x - canvasParameter.currentPosition.x;
      const deltaY = pos.y - canvasParameter.currentPosition.y;
      setCanvasParameter(prevState => ({
        ...prevState,
        prevPosition: prevState.currentPosition,
        currentPosition: pos,
        offset: {
          x: prevState.offset.x + deltaX,
          y: prevState.offset.y + deltaY,
        },
      }));
    }
  };

  /**
   * マウスホイール操作時.
   */
  const handleMouseWheel = (e: WheelEvent) => {
    if (e.deltaY > 0) {
      setCanvasParameter(prevState => ({
        ...prevState,
        scale: Math.max(0.2, prevState.scale - 0.04),
      }));
    }
    if (e.deltaY < 0) {
      setCanvasParameter(prevState => ({
        ...prevState,
        scale: Math.min(2.0, prevState.scale + 0.04),
      }));
    }
    e.preventDefault();
  };

  /**
   * マウスDown時.
   */
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setCanvasParameter(prevState => ({
      ...prevState,

      mouseDownL:
        e.button === E_MOUSE_BUTTON.LEFT ? true : prevState.mouseDownL,
      mouseOriginL:
        e.button === E_MOUSE_BUTTON.LEFT ? pos : prevState.mouseOriginL,

      mouseDownM:
        e.button === E_MOUSE_BUTTON.MIDDLE ? true : prevState.mouseDownM,
      mouseOriginM:
        e.button === E_MOUSE_BUTTON.MIDDLE ? pos : prevState.mouseOriginM,

      mouseDownR:
        e.button === E_MOUSE_BUTTON.RIGHT ? true : prevState.mouseDownR,
      mouseOriginR:
        e.button === E_MOUSE_BUTTON.RIGHT ? pos : prevState.mouseOriginR,

      prevPosition: pos,
      currentPosition: pos,
    }));
    e.preventDefault();
  };

  /**
   * マウスUp時.
   */
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setCanvasParameter(prevState => ({
      ...prevState,
      mouseDownL:
        e.button === E_MOUSE_BUTTON.LEFT ? false : prevState.mouseDownL,
      mouseDownM:
        e.button === E_MOUSE_BUTTON.MIDDLE ? false : prevState.mouseDownM,
      mouseDownR:
        e.button === E_MOUSE_BUTTON.RIGHT ? false : prevState.mouseDownR,
      prevPosition: pos,
      currentPosition: pos,
    }));

    // Lの時にOriginと距離が近い場合はクリックと判断する.
    if (
      e.button === E_MOUSE_BUTTON.LEFT &&
      distance2D(pos, canvasParameter.mouseOriginL) < 5
    ) {
      handleMouseClick(e);
    }

    e.preventDefault();
  };

  /**
   * マウスクリック時.
   */
  const handleMouseClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const pos = {
      x: convertCanvas2ObjectX(ctx, e.clientX - rect.left),
      y: convertCanvas2ObjectY(ctx, e.clientY - rect.top),
    };

    // レイキャストを発生させてオブジェクトを探索する.
    const target = objectList.find(object => {
      return (
        object.position.x - object.size.x / 2 < pos.x &&
        object.position.x + object.size.x / 2 > pos.x &&
        object.position.y - object.size.y / 2 < pos.y &&
        object.position.y + object.size.y / 2 > pos.y
      );
    });

    if (!!target) {
      setCanvasParameter(prevState => ({
        ...prevState,
        captureObject: target,
      }));
    } else {
      setCanvasParameter(prevState => ({
        ...prevState,
        captureObject: null,
      }));
    }
  };

  /**
   * マウスが離れた時.
   */
  const handleMouseLeave = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setCanvasParameter(prevState => ({
      ...prevState,
      mouseDownL: false,
    }));
    e.preventDefault();
  };

  return (
    <Box
      sx={{
        ...sx,
      }}
      id={'wrapper'}
    >
      <Closable open={!!canvasParameter.captureObject}>
        <DialogConfirm
          open={!!canvasParameter.captureObject}
          labels={{
            content: `オブジェクト${canvasParameter.captureObject?.name}を選択しました。`,
            confirm: '閉じる',
          }}
          actions={{
            confirm: () =>
              setCanvasParameter(prevState => ({
                ...prevState,
                captureObject: null,
              })),
          }}
        />
      </Closable>
      <canvas
        id={'canvas'}
        ref={canvasRef}
        width={canvasWidth}
        height={400}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
    </Box>
  );
};
