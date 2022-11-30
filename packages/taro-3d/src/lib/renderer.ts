import { ColorRepresentation, OffscreenCanvas, WebGLRenderer, WebGLRendererParameters } from 'three';

import { ExpoWebGLRenderingContext } from './View3D.types';
export interface IRendererParameters extends WebGLRendererParameters {
  gl: ExpoWebGLRenderingContext;
  pixelRatio?: number;
  clearColor?: ColorRepresentation;
  width?: number;
  height?: number;
}
export class Renderer extends WebGLRenderer {
  constructor({ gl: context, canvas, pixelRatio = 1, clearColor, width, height, ...props }: IRendererParameters) {
    const inputCanvas = canvas || {
      width: context.drawingBufferWidth,
      height: context.drawingBufferHeight,
      style: {},
      addEventListener: () => {},
      removeEventListener: () => {},
      clientHeight: context.drawingBufferHeight
    };
    super({
      canvas: inputCanvas as HTMLCanvasElement | OffscreenCanvas | undefined,
      context,
      ...props
    });
    this.setPixelRatio(pixelRatio);
    if (width && height) {
      this.setSize(width, height);
    }
    if (clearColor) {
      this.setClearColor(clearColor);
    }
  }
}
