import { Canvas, ITouchEvent, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import React, { forwardRef, memo, useEffect, useRef, useState } from 'react';

import EventTarget from './EventTarget';
import copyProperties from './copyProperties';
import WxCanvas from './wx-canvas';
interface IProps {
  canvasId?: string;
  onContextCreate: (canvas: unknown) => void;
}
function EchartsComponetMP(props: IProps, ref?: any) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const events = useRef(
    (() => {
      const callbacks: {
        [key: string]: ((event: ITouchEvent) => void)[];
      } = {};
      const target = (name: string, e: ITouchEvent) => {
        if (callbacks[name]) {
          callbacks[name].map((callback) => callback(e));
        }
      };
      return {
        click: (e: any) => {
          target('click', e);
        },
        touchstart: (e: any) => {
          target('touchstart', e);
        },
        touchmove: (e: any) => {
          target('touchmove', e);
        },
        touchend: (e: any) => {
          target('touchend', e);
        },
        addEventListener: (type: string, callback: (event: ITouchEvent) => void) => {
          if (!callbacks[type]) {
            callbacks[type] = [];
          }
          callbacks[type].push(callback);
        }
      };
    })()
  );

  useEffect(() => {
    setTimeout(() => {
      const query = Taro.createSelectorQuery();
      query
        .select(`#${props.canvasId ?? 'i-echarts'}`)
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          const dpr = Taro.getSystemInfoSync().pixelRatio;
          canvas.width = res[0].width * dpr;
          canvas.height = res[0].height * dpr;
          Object.defineProperty(canvas, 'style', {
            get() {
              return {
                width: this.width / dpr + 'px',
                height: this.height / dpr + 'px'
              };
            }
          });
          Object.defineProperty(canvas, 'clientHeight', {
            get() {
              return this.height / dpr + 'px';
            }
          });
          Object.defineProperty(canvas, 'clientWidth', {
            get() {
              return this.width / dpr + 'px';
            }
          });

          copyProperties(canvas.constructor.prototype, EventTarget.prototype);

          const chartCanvas = new WxCanvas(ctx, props.canvasId ?? 'i-echarts', true, canvas, events.current);
          // @ts-ignore
          echarts.setPlatformAPI({ createCanvas: () => chartCanvas });
          chartCanvas && props.onContextCreate(chartCanvas);
          setCanvas(canvas);
        });
    }, 0);
  }, []);
  return (
    <View style={{ width: canvas?.style.width, height: canvas?.style.height }}>
      <Canvas
        canvasId={props.canvasId ?? 'i-echarts'}
        id={props.canvasId ?? 'i-echarts'}
        type="2d"
        style={{ width: canvas?.style.width, height: canvas?.style.height }}
        ref={ref}
        onClick={events.current.click}
        onTouchStart={events.current.touchstart}
        onTouchMove={events.current.touchmove}
        onTouchEnd={events.current.touchend}
      />
    </View>
  );
}
export const Echarts = memo(forwardRef(EchartsComponetMP));
export const EchartsRenderer = CanvasRenderer;
