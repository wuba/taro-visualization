import React, { useEffect, useRef } from 'react';

import { Renderer } from './renderer';

export interface IProps {
  canvasId?: string;
  onContextCreate(gl: any): void;
}

export const View3D = (props: IProps) => {
  const Ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = Ref.current;
    if (canvas) {
      const gl = canvas.getContext('webgl');
      // @ts-ignore
      gl.endFrameEXP = () => {};
      !!props.onContextCreate && props.onContextCreate(gl);
    }
  }, []);
  return <canvas id={props.canvasId ?? 'view3d'} ref={Ref} />;
};

export default {
  View3D,
  Renderer
};
