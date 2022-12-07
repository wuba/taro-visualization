let instance;
let three;
if (process.env.TARO_ENV === 'weapp') {
  instance = require('./lib/mp/view3D/mp');
  three = require('./lib/mp/threeD/index');
} else if (process.env.TARO_ENV === 'h5') {
  // instance = require('./lib/web');
  instance = require('./lib/h5/view3D/h5');
  three = require('./lib/h5/threeD/index');
} else if (process.env.TARO_ENV === 'rn') {
  instance = require('./lib/rn/view3D/rn');
  three = require('./lib/rn/threeD/index');
}
const threeD = instance.default;
export const View3D = threeD.View3D;
export const Renderer = threeD.Renderer;
export const TextureLoader = three.TextureLoader;
export const loadAsync = three.loadAsync;
