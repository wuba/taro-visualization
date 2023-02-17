import { View } from '@tarojs/components';
import { CanvasRenderer } from 'echarts/renderers';
import React, { useEffect, useRef } from 'react';
import { useMemo } from 'react';

interface IProps {
  canvasId?: string;
  onContextCreate: any;
}

function EchartsComponetH5(props: IProps) {
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
      });
      viewResizeObserver.observe(view);
    }
    return () => {
      if (viewResizeObserver && view) {
        viewResizeObserver.unobserve(view);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvasRef.current && props.onContextCreate(canvas);
  }, [canvasRef]);

  return (
    <View {...domProps} ref={viewRef}>
      <canvas id={props?.canvasId ?? 'i-echarts'} ref={canvasRef} />
    </View>
  );
}
export const Echarts = EchartsComponetH5;
export const EchartsRenderer = CanvasRenderer;
