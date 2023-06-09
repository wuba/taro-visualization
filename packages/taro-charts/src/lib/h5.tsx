import { CanvasRenderer } from 'echarts/renderers';
import React, { useEffect, useRef } from 'react';
import { useMemo } from 'react';

interface IProps {
  canvasId?: string;
  onContextCreate: (canvas: HTMLCanvasElement | null) => void;
}

function EchartsComponetH5(props: IProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { canvasId, onContextCreate } = useMemo(() => {
    return { ...props };
  }, [props]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvasRef.current && onContextCreate(canvas);
  }, [canvasRef]);

  return (
    <div style={{ width: canvasRef.current?.width, height: canvasRef.current?.height }}>
      <canvas id={canvasId ?? 'i-echarts'} ref={canvasRef} />
    </div>
  );
}
export const Echarts = EchartsComponetH5;
export const EchartsRenderer = CanvasRenderer;
