import { Canvas, View, ViewProps } from '@tarojs/components';
import Taro from '@tarojs/taro';
import * as React from 'react';
import { useEffect, useMemo } from 'react';

import { ExpoWebGLRenderingContext } from './View3D.types';
import { Renderer } from './renderer';

export interface IProps extends ViewProps {
  canvasId?: string;
  onContextCreate(gl: ExpoWebGLRenderingContext, canvas?: HTMLCanvasElement): void;
}

const View3D = (props: IProps) => {
  const { canvasId, onContextCreate, ...domProps } = useMemo(() => {
    return { ...props };
  }, [props]);

  document.createElementNS = (namespaceURI: string, tagName: string) => {
    tagName = tagName.toLowerCase();
    if (tagName === 'img') {
      const canvas = Taro.createOffscreenCanvas({});
      const image = canvas.createImage();
      return image;
    }
    return document.createElementNS(namespaceURI, tagName);
  };

  useEffect(() => {
    setTimeout(() => {
      const query = Taro.createSelectorQuery();
      query
        .select(`#${props.canvasId ?? 'view3d'}`)
        .node()
        .exec((res) => {
          const canvas = res[0].node;
          const gl = canvas.getContext('webgl') as ExpoWebGLRenderingContext;
          gl.endFrameEXP = () => {};
          !!props.onContextCreate && props.onContextCreate(gl);
        });
    }, 0);
  }, []);

  return (
    <View {...domProps}>
      <Canvas
        canvasId={props.canvasId ?? 'view3d'}
        id={props.canvasId ?? 'view3d'}
        type="webgl"
        width="100%"
        height="100%"
      />
    </View>
  );
};

export default {
  View3D,
  Renderer
};
