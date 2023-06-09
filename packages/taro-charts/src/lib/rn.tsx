import { SkiaChart, SvgChart, SVGRenderer } from '@wuba/react-native-echarts';
import React, { useEffect, useMemo, useRef } from 'react';

interface IProps {
  RNRenderType?: 'svg' | 'skia';
  onContextCreate: (canvas: unknown) => void;
}
function EchartsComponetRN(props: IProps) {
  const chartRef = useRef();
  const component = useMemo(() => {
    if (props.RNRenderType === 'svg') return <SvgChart ref={chartRef}></SvgChart>;
    return <SkiaChart ref={chartRef}></SkiaChart>;
  }, [props]);

  useEffect(() => {
    chartRef.current && props.onContextCreate(chartRef.current);
  }, [chartRef]);

  return component;
}
export const Echarts = EchartsComponetRN;
export const EchartsRenderer = SVGRenderer;
