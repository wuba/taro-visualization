import { View, ViewProps } from '@tarojs/components';
import React from 'react';
import { forwardRef, memo } from "react";


function EchartsComponetH5(props?: ViewProps, ref?: any){
    return <View ref={ref} {...props}></View>
}
export const Echarts = memo(forwardRef(EchartsComponetH5));
export const SVGRenderer = {};