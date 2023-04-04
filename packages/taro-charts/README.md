# taro-charts

Echarts component for Taro, support WeChat mini-programs, H5 and React Native application.

## Installing

```
yarn add taro-charts
```

## Basic Usage

```tsx
import Taro from '@tarojs/taro';
import * as echarts from 'echarts/core';
import {
  BarChart,
} from 'echarts/charts';

import {
  TitleComponent,
  TooltipComponent,
  GridComponent
} from 'echarts/components';
import {Echarts, EchartsRenderer} from 'taro-charts'
import { useEffect, useRef, useState } from 'react';

// register extensions
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    EchartsRenderer,
    BarChart,
  ])
  
  const E_HEIGHT = 250;
  const E_WIDTH = 300;

export default function TaorEcharts({ option ={
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
      },
    ],
  } }) {
    const ref = useRef<any>(null);
    const [chart, setChart] = useState<echarts.ECharts>();

    const clickedCharts = useCallback(()=>{
      chart?.on('click', function(params) {
        // do something
        console.log(params)
    });
    },[chart])

    useEffect(()=>{
      clickedCharts()
      return () => {
        if (process.env.TARO_ENV !== 'weapp') {
          chart?.dispose()
        }
      }
    },[chart])
    
    return <Echarts 
      style={{flex: 1, height: E_HEIGHT, width: E_WIDTH }} 
      RNRenderType='svg' // RN端需要指定渲染引擎
      canvasId='如果要渲染多个图表 需要指定不同的id'  
      onContextCreate={(canvas)=>{
            const charts = echarts.init(canvas, 'light', {
              renderer: 'svg',
              width: E_WIDTH,
              height: E_HEIGHT,
          });
          canvas.setChart?.(charts);
          charts.setOption(option);
          setChart(charts)
      }}
    />;
  }
```
