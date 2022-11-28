let instance;
if (process.env.TARO_ENV === 'weapp') {
  instance = require('./lib/mp');
} else if (process.env.TARO_ENV === 'h5') {
  // instance = require('./lib/web');
  instance = require('./lib/h5');
} else {
  instance = require('./lib/rn');
}
const threeD = instance.default;
export const View3D = threeD.View3D;
export const Renderer = threeD.Renderer;
