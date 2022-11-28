import Taro from '@tarojs/taro';
import * as React from 'react';
import { WebGLRenderer } from 'three';

import {
  ComponentOrHandle,
  ExpoWebGLRenderingContext,
  GLSnapshot,
  GLViewProps,
  SnapshotOptions,
  WebGLObject
} from './View3D.types';

function getImageForAsset(asset: {
  downloadAsync: () => Promise<any>;
  uri?: string;
  localUri?: string;
}): HTMLImageElement | any {
  if (asset != null && typeof asset === 'object' && asset !== null && !!asset.downloadAsync) {
    const dataURI = asset.localUri || asset.uri || '';
    const image = new Image();
    image.src = dataURI;
    return image;
  }
  return asset;
}

function isOffscreenCanvas(element: any): boolean {
  return element && typeof element.convertToBlob === 'function';
}

function asExpoContext(gl: ExpoWebGLRenderingContext): WebGLRenderingContext {
  gl.endFrameEXP = function glEndFrameEXP(): void {};
  // @ts-ignore
  if (!gl['_expo_texImage2D']) {
    // @ts-ignore
    gl['_expo_texImage2D'] = gl.texImage2D;
    gl.texImage2D = (...props: any[]): any => {
      const nextProps = [...props];
      nextProps.push(getImageForAsset(nextProps.pop()));
      // @ts-ignore
      return gl['_expo_texImage2D'](...nextProps);
    };
  }
  // @ts-ignore
  if (!gl['_expo_texSubImage2D']) {
    // @ts-ignore
    gl['_expo_texSubImage2D'] = gl.texSubImage2D;
    gl.texSubImage2D = (...props: any[]): any => {
      const nextProps = [...props];
      nextProps.push(getImageForAsset(nextProps.pop()));
      // @ts-ignore
      return gl['_expo_texSubImage2D'](...nextProps);
    };
  }

  return gl;
}

function ensureContext(canvas?: HTMLCanvasElement, contextAttributes?: WebGLContextAttributes): WebGLRenderingContext {
  if (!canvas) {
    throw new Error('ERR_GL_INVALID Attempting to use the GL context before it has been created.');
  }

  // Apple disables WebGL 2.0 and doesn't provide any way to detect if it's disabled.
  const isIOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

  const context =
    (!isIOS && canvas.getContext('webgl2', contextAttributes)) ||
    canvas.getContext('webgl', contextAttributes) ||
    canvas.getContext('webgl-experimental', contextAttributes) ||
    canvas.getContext('experimental-webgl', contextAttributes);
  return asExpoContext(context as ExpoWebGLRenderingContext);
}

// @needsAudit @docsMissing
export type GLViewWebProps = GLViewProps & {
  onContextCreate: (gl: WebGLRenderingContext) => void;
  onContextRestored?: (gl?: WebGLRenderingContext) => void;
  onContextLost?: () => void;
  webglContextAttributes?: WebGLContextAttributes;
  // @ts-ignore
  nativeRef_EXPERIMENTAL?(callback: ComponentOrHandle | HTMLCanvasElement | null);
};

async function getBlobFromWebGLRenderingContext(
  gl: WebGLRenderingContext,
  options: SnapshotOptions = {}
): Promise<{ width: number; height: number; blob: Blob | null }> {
  const { canvas } = gl;

  let blob: Blob | null = null;

  if (typeof (canvas as any).msToBlob === 'function') {
    // @ts-ignore: polyfill: https://stackoverflow.com/a/29815058/4047926
    blob = await canvas.msToBlob();
  } else if (isOffscreenCanvas(canvas)) {
    blob = await (canvas as any).convertToBlob({ quality: options.compress, type: options.format });
  } else {
    blob = await new Promise((resolve) => {
      (canvas as HTMLCanvasElement).toBlob((blob: Blob | null) => resolve(blob), options.format, options.compress);
    });
  }

  return {
    blob,
    width: canvas.width,
    height: canvas.height
  };
}

export class GLView extends React.Component<GLViewWebProps> {
  canvas?: HTMLCanvasElement;

  gl?: WebGLRenderingContext;

  static async createContextAsync(): Promise<WebGLRenderingContext | null> {
    const canvas = document.createElement('canvas');
    const { windowWidth, windowHeight, pixelRatio } = Taro.getWindowInfo();
    canvas.width = windowWidth * pixelRatio;
    canvas.height = windowHeight * pixelRatio;
    return ensureContext(canvas);
  }

  static async destroyContextAsync(exgl?: WebGLRenderingContext | number): Promise<boolean> {
    // Do nothing
    return true;
  }

  static async takeSnapshotAsync(gl: WebGLRenderingContext, options: SnapshotOptions = {}): Promise<GLSnapshot> {
    const { blob, width, height } = await getBlobFromWebGLRenderingContext(gl, options);

    if (!blob) {
      throw new Error('ERR_GL_SNAPSHOT Failed to save the GL context');
    }

    return {
      uri: blob,
      localUri: '',
      width,
      height
    };
  }

  componentWillUnmount() {
    if (this.gl) {
      const loseContextExt = this.gl.getExtension('WEBGL_lose_context');
      if (loseContextExt) {
        loseContextExt.loseContext();
      }
      this.gl = undefined;
    }
    if (this.canvas) {
      this.canvas.removeEventListener('webglcontextlost', this.onContextLost);
      this.canvas.removeEventListener('webglcontextrestored', this.onContextRestored);
    }
  }

  render() {
    const {
      onContextCreate,
      onContextRestored,
      onContextLost,
      webglContextAttributes,
      msaaSamples,
      nativeRef_EXPERIMENTAL,
      // @ts-ignore
      ref,
      ...domProps
    } = this.props;

    // return <Canvas {...domProps} canvasRef={this.setCanvasRef} />;
    return <canvas {...domProps} />;
  }

  componentDidUpdate(prevProps: GLViewWebProps) {
    const { webglContextAttributes } = this.props;
    if (this.canvas && webglContextAttributes !== prevProps.webglContextAttributes) {
      this.onContextLost(null);
      this.onContextRestored();
    }
  }

  private getGLContextOrReject(): WebGLRenderingContext {
    const gl = this.getGLContext();
    if (!gl) {
      throw new Error('ERR_GL_INVALID Attempting to use the GL context before it has been created.');
    }
    return gl;
  }

  private onContextLost = (event: Event | null): void => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    this.gl = undefined;

    if (typeof this.props.onContextLost === 'function') {
      this.props.onContextLost();
    }
  };

  private onContextRestored = (): void => {
    this.gl = undefined;
    if (this.getGLContext() == null) {
      throw new Error('ERR_GL_INVALID Failed to restore GL context.');
    }
  };

  private getGLContext(): WebGLRenderingContext | null {
    console.log(`web, getGLContext`, this);
    if (this.gl) return this.gl;

    if (this.canvas) {
      this.gl = ensureContext(this.canvas, this.props.webglContextAttributes);
      if (typeof this.props.onContextCreate === 'function') {
        this.props.onContextCreate(this.gl);
      }
      return this.gl;
    }
    return null;
  }

  // private setCanvasRef = (canvas: HTMLCanvasElement): void => {
  //   this.canvas = canvas;

  //   if (typeof this.props.nativeRef_EXPERIMENTAL === 'function') {
  //     this.props.nativeRef_EXPERIMENTAL(canvas);
  //   }

  //   if (this.canvas) {
  //     this.canvas.addEventListener('webglcontextlost', this.onContextLost);
  //     this.canvas.addEventListener('webglcontextrestored', this.onContextRestored);

  //     this.getGLContext();
  //   }
  // };

  public async takeSnapshotAsync(options: SnapshotOptions = {}): Promise<GLSnapshot> {
    if (!GLView.takeSnapshotAsync) {
      throw new Error('takeSnapshotAsync');
    }

    const gl = this.getGLContextOrReject();
    return await GLView.takeSnapshotAsync(gl, options);
  }

  public async startARSessionAsync(): Promise<void> {
    throw new Error('startARSessionAsync');
  }

  public async createCameraTextureAsync(): Promise<void> {
    throw new Error('createCameraTextureAsync');
  }

  public async destroyObjectAsync(glObject: WebGLObject): Promise<void> {
    throw new Error('destroyObjectAsync');
  }
}

export default {
  View3D: GLView,
  Renderer: WebGLRenderer
};
