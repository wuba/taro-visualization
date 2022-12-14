import React, { forwardRef, memo, useMemo } from 'react';
import { SkiaChart, SvgChart } from 'wrn-echarts';
export { SVGRenderer } from 'wrn-echarts';

interface IProps {
  RNRenderType?: 'svg' | 'skia';
}
function EchartsComponet(props: IProps, ref?: any) {
  const component = useMemo(() => {
    if (props.RNRenderType === 'svg') return <SvgChart ref={ref}></SvgChart>;
    return <SkiaChart ref={ref}></SkiaChart>;
  }, [props, ref]);

  return component;
}
export const Echarts = memo(forwardRef(EchartsComponet));
