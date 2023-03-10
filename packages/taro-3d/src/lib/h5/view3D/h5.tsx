import { View, ViewProps } from '@tarojs/components';
import React, { useEffect, useMemo, useRef } from 'react';
import { OffscreenCanvas } from 'three';

import { ExpoWebGLRenderingContext } from '../../View3D.types';
import { Renderer } from '../../renderer';

export interface IProps extends ViewProps {
  canvasId?: string;
  onContextCreate(gl: ExpoWebGLRenderingContext, canvas: HTMLCanvasElement | OffscreenCanvas): void;
}

export const View3D = (props: IProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);

  const { canvasId, onContextCreate, ...domProps } = useMemo(() => {
    return { ...props };
  }, [props]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const view = viewRef.current;
    let viewResizeObserver: ResizeObserver;
    if (view && canvas) {
      viewResizeObserver = new ResizeObserver((entries) => {
        canvas.height = entries[0].contentRect.height;
        canvas.width = entries[0].contentRect.width;
        const gl = canvas.getContext('webgl') as ExpoWebGLRenderingContext;
        gl.endFrameEXP = () => {};
        !!props.onContextCreate && props.onContextCreate(gl, canvas);
      });
      viewResizeObserver.observe(view);
    }
    return () => {
      if (viewResizeObserver && view) {
        viewResizeObserver.unobserve(view);
      }
    };
  }, []);

  return (
    <View {...domProps} ref={viewRef}>
      <canvas id={props.canvasId ?? 'view3d'} ref={canvasRef} />
    </View>
  );
};

export default {
  View3D,
  Renderer
};
