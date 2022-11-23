let instance;
if (process.env.TARO_ENV === 'weapp') {
  console.log(`env: ${process.env.TARO_ENV}`);
} else if (process.env.TARO_ENV === 'h5') {
  instance = require('./lib/web');
} else {
  instance = require('./lib/rn');
}
const threeD = instance.default;
export const View3D = threeD.View3D;
export const Renderer = threeD.Renderer;
