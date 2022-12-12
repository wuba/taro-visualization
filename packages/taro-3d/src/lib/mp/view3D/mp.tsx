import { Canvas, View, ViewProps } from '@tarojs/components';
import Taro from '@tarojs/taro';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import EventTarget from '../../../utils/EventTarget';
import copyProperties from '../../../utils/copyProperties';
import { ExpoWebGLRenderingContext } from '../../View3D.types';
import { Renderer } from '../../renderer';

export interface IProps extends ViewProps {
  canvasId?: string;
  onContextCreate(gl: ExpoWebGLRenderingContext, canvas?: HTMLCanvasElement): void;
}

const View3D = (props: IProps) => {
  const { canvasId, onContextCreate, ...domProps } = useMemo(() => {
    return { ...props };
  }, [props]);

  const [canvas, setCanvas] = useState();

  useEffect(() => {
    setTimeout(() => {
      const query = Taro.createSelectorQuery();
      query
        .select(`#${props.canvasId ?? 'view3d'}`)
        .node()
        .exec((res) => {
          const canvas = res[0].node;
          Object.defineProperty(canvas, 'style', {
            get() {
              return {
                width: this.width + 'px',
                height: this.height + 'px'
              };
            }
          });
          Object.defineProperty(canvas, 'clientHeight', {
            get() {
              return this.height;
            }
          });
          Object.defineProperty(canvas, 'clientWidth', {
            get() {
              return this.width;
            }
          });

          setCanvas(canvas);

          copyProperties(canvas.constructor.prototype, EventTarget.prototype);
          setCanvas(canvas);

          const gl = canvas.getContext('webgl') as ExpoWebGLRenderingContext;
          gl.endFrameEXP = () => {};
          !!props.onContextCreate && props.onContextCreate(gl, canvas);
        });
    }, 0);
  }, []);

  const touchStart = useCallback(
    (e) => {
      setTimeout(() => {
        canvas &&
          canvas.dispatchTouchEvent({ ...e.mpEvent, target: canvas, pointerType: 'touch', type: 'pointerdown' });
      }, 0);
    },
    [canvas]
  );
  const touchMove = useCallback(
    (e) => {
      canvas && canvas.dispatchTouchEvent({ ...e.mpEvent, target: canvas, pointerType: 'touch', type: 'pointermove' });
    },
    [canvas]
  );
  const touchEnd = useCallback(
    (e) => {
      canvas && canvas.dispatchTouchEvent({ ...e.mpEvent, target: canvas, pointerType: 'touch', type: 'pointerup' });
    },
    [canvas]
  );

  return (
    <View {...domProps}>
      <Canvas
        canvasId={props.canvasId ?? 'view3d'}
        id={props.canvasId ?? 'view3d'}
        type="webgl"
        width="100%"
        height="100%"
        onTouchStart={touchStart}
        onTouchMove={touchMove}
        onTouchEnd={touchEnd}
      />
    </View>
  );
};

export default {
  View3D,
  Renderer
};
