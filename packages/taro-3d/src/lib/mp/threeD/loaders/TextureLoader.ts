import Taro from '@tarojs/taro';
import * as THREE from 'three';

class TextureLoader extends THREE.TextureLoader {
  constructor() {
    super();
    // @ts-ignore
    document.createElementNS = (namespaceURI: string, qualifiedName: string) => {
      qualifiedName = qualifiedName.toLowerCase();
      if (qualifiedName === 'img') {
        const canvas = Taro.createOffscreenCanvas({});
        const image = canvas.createImage();
        return image as unknown as HTMLElement;
      }
      if (qualifiedName === 'canvas') return Taro.createOffscreenCanvas({}) as unknown as HTMLElement;
      return document.createElementNS(namespaceURI, qualifiedName) as HTMLElement;
    };
  }
}
export { TextureLoader };
