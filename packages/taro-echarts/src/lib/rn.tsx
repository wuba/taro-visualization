import React, { useEffect, useMemo, useRef } from 'react';
import { SkiaChart, SvgChart } from 'wrn-echarts';
export { SVGRenderer } from 'wrn-echarts';

interface IProps {
  RNRenderType?: 'svg' | 'skia';
  onContextCreate: any;
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
