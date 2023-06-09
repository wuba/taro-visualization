# taro-charts

Echarts component for Taro, support WeChat mini-programs, H5 and React Native application.

## Installing

```
yarn add taro-charts
```

## Basic Usage

```tsx
import Taro,{setNavigationBarTitle} from '@tarojs/taro';
import * as echarts from 'echarts/core';
import {
    BarChart,
} from 'echarts/charts';
import {
  GridComponent
} from 'echarts/components';
import {Echarts, EchartsRenderer} from 'taro-charts'
import { useCallback, useEffect, useMemo, useState } from 'react';

echarts.use([
  GridComponent,
    EchartsRenderer,
    BarChart,
  ])

const {windowWidth} = Taro.getSystemInfoSync()
const E_HEIGHT = 300;
const E_WIDTH = windowWidth;

export default function LoupanView() {
  useEffect(() => {
    setNavigationBarTitle({ title: '基础折线图' });
  }, []);

  const option = useMemo(()=>{
    return{
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [150, 230, 224, 218, 135, 147, 260],
              type: 'bar'
            }
        ]
    }
  },[])
  const [chart, setChart] = useState<echarts.ECharts>();

  useEffect(()=>{
    clickedCharts()
    return ()=> {
      if (process.env.TARO_ENV !== 'weapp') {
        chart?.dispose()
      }
    }
  },[chart])

  const clickedCharts = useCallback(()=>{
    chart?.on('click', function(params) {
      console.log(params)
  });
  },[chart])

  return <Echarts
          // 只有RN端需要指定RNRenderType的类型('skia'|'svg')
          // Please specify the RNRenderType('skia'|'svg'), when you use ReactNative
          RNRenderType='skia'
          // 如果要渲染多个图表，需要指定不同的canvasId
          // Please specify different canvasId, when you want to use multiple charts, 
          canvasId='chart'
          onContextCreate={(canvas)=>{
            const chart = echarts.init(canvas, 'light', {
              renderer: 'svg',
              width: E_WIDTH,
              height: E_HEIGHT,
            });
            canvas.setChart?.(chart);
            chart.setOption(option);
            setChart(chart)
          }}
        />;
  }
```
