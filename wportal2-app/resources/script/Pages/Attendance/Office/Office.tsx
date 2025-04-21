import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { Box } from '@mui/material';
import { Closable } from '@/script/Component/Misc/Closable';
import { DialogConfirm } from '@/script/Component/Misc/DialogConfirm';
import { E_MOUSE_BUTTON } from '@/script/Common/Canvas/Enum/EMouseButton';
import { Canvas } from '@/script/Common/Canvas/Canvas';
import { IObject } from '@/script/Common/Canvas/Object';
import { MathVector } from '@/script/Common/Canvas/Math/MathVector';

interface IProps extends IPropsBase {}
export const Office: React.FC<IProps> = ({ sx }) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = React.useState<Canvas>(new Canvas());

  const objectList: IObject[] = [
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
    // 画面幅を取得.
    const clientWidth = document?.getElementById('wrapper')?.clientWidth ?? 0;
    const clientHeight = document?.getElementById('wrapper')?.clientHeight ?? 0;

    // 初期化.
    canvas.init(
      canvasRef.current as HTMLCanvasElement,
      clientWidth,
      clientHeight,
    );

    // キャンバスのサイズを画面幅一杯に修正.
    setCanvas(canvas.resizeInstance(clientWidth, canvas.getSize().y));

    // キャンバスにホイールイベント登録.
    document
      ?.getElementById('canvas')
      ?.addEventListener('wheel', handleMouseWheel);

    // 画面がリサイズされたらキャンバスのサイズを修正するイベントを登録.
    window.addEventListener('resize', () => {
      const width = document?.getElementById('wrapper')?.clientWidth ?? 0;
      setCanvas(canvas.resizeInstance(width, canvas.getSize().y));
    });
  }, []);

  /**
   * キャンバスの再描画.
   */
  React.useEffect(() => {
    const context = canvas.getContext();
    const scale = canvas.getParameter().scale;

    // キャンバスのクリア.
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.getSize().x, canvas.getSize().y);

    // オブジェクト描画.
    objectList.map(object => {
      // オブジェクト自体の描画.
      context.beginPath();
      context.fillStyle = object.color;
      const canvasX =
        MathVector.object2CanvasX(canvas, object.position.x) -
        (object.size.x / 2) * scale;
      const canvasY =
        MathVector.object2CanvasY(canvas, object.position.y) -
        (object.size.y / 2) * scale;
      context.rect(
        canvasX,
        canvasY,
        object.size.x * scale,
        object.size.y * scale,
      );
      context.fill();

      // 選択枠の描画.
      context.beginPath();
      context.strokeStyle = 'black';
      context.rect(
        canvasX,
        canvasY,
        object.size.x * scale,
        object.size.y * scale,
      );
      context.stroke();

      // オーバーレイ枠の描画.
      if (canvas.getParameter().overlayObject?.id === object.id) {
        context.beginPath();
        context.strokeStyle = 'yellow';
        context.rect(
          canvasX,
          canvasY,
          object.size.x * scale,
          object.size.y * scale,
        );
        context.stroke();
      }
    });

    context.font = '20px serif';
    context.fillStyle = 'black';
    context.fillText(`Scale:${scale}`, 0, 20);
  }, [canvas]);

  /**
   * キャンバス操作.
   */

  /**
   * マウスの移動時.
   */
  const handleMouseMove = (e: React.WheelEvent<HTMLCanvasElement>) => {
    const rect = canvasRef?.current?.getBoundingClientRect() ?? new DOMRect();
    const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const parameter = canvas.getParameter();

    // 何れかのボタンが押されている時.
    if (parameter.mouseDownL || parameter.mouseDownM || parameter.mouseDownR) {
      const deltaX = pos.x - parameter.currentPosition.x;
      const deltaY = pos.y - parameter.currentPosition.y;
      setCanvas(prevState => {
        return prevState.setParameter({
          ...prevState.getParameter(),
          prevPosition: prevState.getParameter().currentPosition,
          currentPosition: pos,
          offset: {
            x: prevState.getParameter().offset.x + deltaX,
            y: prevState.getParameter().offset.y + deltaY,
          },
        });
      });
    } else {
      const objectPos = MathVector.canvas2Object(canvas, parameter, pos);

      // レイキャストを発生させてオブジェクトを探索する.
      const target = objectList.find(object => {
        return (
          object.position.x - object.size.x / 2 < objectPos.x &&
          object.position.x + object.size.x / 2 > objectPos.x &&
          object.position.y - object.size.y / 2 < objectPos.y &&
          object.position.y + object.size.y / 2 > objectPos.y
        );
      });

      // オーバーレイしているオブジェクトが存在するなら.
      if (target) {
        setCanvas(prevState => {
          return prevState.setParameter({
            ...prevState.getParameter(),
            overlayObject: target,
          });
        });
      }
    }
  };

  /**
   * マウスホイール操作時.
   */
  const handleMouseWheel = (e: WheelEvent) => {
    if (e.deltaY > 0) {
      setCanvas(prevState => {
        return prevState.setParameter({
          ...prevState.getParameter(),
          scale: Math.max(0.2, prevState.getParameter().scale - 0.04),
        });
      });
    }
    if (e.deltaY < 0) {
      setCanvas(prevState => {
        return prevState.setParameter({
          ...prevState.getParameter(),
          scale: Math.min(2.0, prevState.getParameter().scale + 0.04),
        });
      });
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
    setCanvas(prevState => {
      return prevState.setParameter({
        ...prevState.getParameter(),
        mouseDownL:
          e.button === E_MOUSE_BUTTON.LEFT
            ? true
            : prevState.getParameter().mouseDownL,
        mouseOriginL:
          e.button === E_MOUSE_BUTTON.LEFT
            ? pos
            : prevState.getParameter().mouseOriginL,

        mouseDownM:
          e.button === E_MOUSE_BUTTON.MIDDLE
            ? true
            : prevState.getParameter().mouseDownM,
        mouseOriginM:
          e.button === E_MOUSE_BUTTON.MIDDLE
            ? pos
            : prevState.getParameter().mouseOriginM,

        mouseDownR:
          e.button === E_MOUSE_BUTTON.RIGHT
            ? true
            : prevState.getParameter().mouseDownR,
        mouseOriginR:
          e.button === E_MOUSE_BUTTON.RIGHT
            ? pos
            : prevState.getParameter().mouseOriginR,

        prevPosition: pos,
        currentPosition: pos,
      });
    });
    e.preventDefault();
  };

  /**
   * マウスUp時.
   */
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvasRefCurrent = canvasRef.current;
    if (!canvasRefCurrent) {
      return;
    }
    const rect = canvasRefCurrent.getBoundingClientRect();
    const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    setCanvas(prevState => {
      return prevState.setParameter({
        ...prevState.getParameter(),
        mouseDownL:
          e.button === E_MOUSE_BUTTON.LEFT
            ? false
            : prevState.getParameter().mouseDownL,
        mouseDownM:
          e.button === E_MOUSE_BUTTON.MIDDLE
            ? false
            : prevState.getParameter().mouseDownM,
        mouseDownR:
          e.button === E_MOUSE_BUTTON.RIGHT
            ? false
            : prevState.getParameter().mouseDownR,
        prevPosition: pos,
        currentPosition: pos,
      });
    });

    // Lの時にOriginと距離が近い場合はクリックと判断する.
    if (
      e.button === E_MOUSE_BUTTON.LEFT &&
      MathVector.distance2D(pos, canvas.getParameter().mouseOriginL) < 5
    ) {
      handleMouseClick(e);
    }

    e.preventDefault();
  };

  /**
   * マウスクリック時.
   */
  const handleMouseClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef?.current?.getBoundingClientRect() ?? new DOMRect();
    const pos = {
      x: MathVector.canvas2ObjectX(
        canvas,
        canvas.getParameter(),
        e.clientX - rect.left,
      ),
      y: MathVector.canvas2ObjectY(
        canvas,
        canvas.getParameter(),
        e.clientY - rect.top,
      ),
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
      // 対象が見つかる場合.
      setCanvas(prevState => {
        return prevState.setParameter({
          ...prevState.getParameter(),
          captureObject: target,
        });
      });
    } else {
      // 対象が見つからない場合.
      setCanvas(prevState => {
        return prevState.setParameter({
          ...prevState.getParameter(),
          captureObject: null,
        });
      });
    }
  };

  /**
   * マウスが離れた時.
   */
  const handleMouseLeave = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setCanvas(prevState => {
      return prevState.setParameter({
        ...prevState.getParameter(),
        mouseDownL: false,
      });
    });
    e.preventDefault();
  };

  return (
    <Box
      sx={{
        ...sx,
      }}
      id={'wrapper'}
    >
      <Closable open={!!canvas.getParameter().captureObject}>
        <DialogConfirm
          open={!!canvas.getParameter().captureObject}
          labels={{
            content: `オブジェクト${canvas.getParameter().captureObject?.name}を選択しました。`,
            confirm: '閉じる',
          }}
          actions={{
            confirm: () =>
              setCanvas(prevState => {
                return prevState.setParameter({
                  ...prevState.getParameter(),
                  captureObject: null,
                });
              }),
          }}
        />
      </Closable>
      <canvas
        id={'canvas'}
        ref={canvasRef}
        width={canvas.getSize().x}
        height={400}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
    </Box>
  );
};
