let instance;
if (process.env.TARO_ENV === 'weapp') {
  instance = require('./lib/mp');
} else if (process.env.TARO_ENV === 'h5') {
  instance = require('./lib/h5');
} else if (process.env.TARO_ENV === 'rn') {
  instance = require('./lib/rn');
}

console.log(111222, instance);
export const Echarts = instance.SkiaChart;
export const SVGRenderer = instance.SVGRenderer;
