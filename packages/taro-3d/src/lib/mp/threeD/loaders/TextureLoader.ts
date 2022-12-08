import Taro from '@tarojs/taro';
import * as THREE from 'three';

class TextureLoader extends THREE.TextureLoader {
  constructor() {
    super();
    document.createElementNS = (namespaceURI: string, tagName: string) => {
      tagName = tagName.toLowerCase();
      if (tagName === 'img') {
        const canvas = Taro.createOffscreenCanvas({});
        const image = canvas.createImage();
        return image;
      }
      if (tagName === 'canvas') return Taro.createOffscreenCanvas({});
      return document.createElementNS(namespaceURI, tagName);
    };
  }
}
export { TextureLoader };
