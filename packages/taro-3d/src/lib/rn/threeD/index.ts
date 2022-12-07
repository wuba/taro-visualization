import Taro from '@tarojs/taro';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';

export { TextureLoader } from 'expo-three';

export const loadAsync = (loader: any, url: string) => {
  return new Promise((resolve, reject) => {
    Taro.downloadFile({
      url,
      success: async (res) => {
        const base64 = await FileSystem.readAsStringAsync(res.tempFilePath, {
          encoding: FileSystem.EncodingType.Base64
        });
        const arrayBuffer = decode(base64);
        const object = loader.parse(arrayBuffer, '');
        resolve(object);
      }
    });
  });
};
