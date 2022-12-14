import { Canvas, View, ViewProps } from '@tarojs/components';
import Taro from '@tarojs/taro';
import * as React from 'react';
import { forwardRef, memo, useEffect, useMemo, useState } from 'react';

import EventTarget from './EventTarget';
import copyProperties from './copyProperties';
import WxCanvas from './wx-canvas';
interface IProps {
    canvasId?:string;
    onContextCreate?:any;
}
function EchartsComponetMP(props:IProps , ref?: any) {
  const { canvasId, onContextCreate, ...domProps } = useMemo(() => {
    return { ...props };
  }, [props]);
    const [canvas, setCanvas] = useState();
    useEffect(() => {
        setTimeout(() => {
          const query = Taro.createSelectorQuery();
          query
            .select(`#${props.canvasId ?? 'i-echarts'}`)
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
              copyProperties(canvas.constructor.prototype, EventTarget.prototype);
              setCanvas(canvas);
              const ctx = canvas.getContext('2d');
              const chartCanvas = new WxCanvas(ctx, props.canvasId ?? 'i-echarts', true, canvas)
              props.onContextCreate(chartCanvas)
            });
        }, 0);
      }, []);
      return <View {...domProps} style={{width: 100, height: 100}}><Canvas
        canvasId={props.canvasId ?? 'i-echarts'}
        id={props.canvasId ?? 'i-echarts'}
        type="2d"
        width="100%"
        height="100%"
        ref={ref}
      /></View>
}
export const Echarts = memo(forwardRef(EchartsComponetMP));
export const SVGRenderer = {};
