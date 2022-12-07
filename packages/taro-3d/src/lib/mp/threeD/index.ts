import Taro from '@tarojs/taro';
import { decode } from 'base64-arraybuffer';

export { TextureLoader } from './loaders/TextureLoader';

export const loadAsync = (loader: any, url: string) => {
  return new Promise((resolve, reject) => {
    Taro.downloadFile({
      url,
      success: (res) => {
        Taro.getFileSystemManager().readFile({
          filePath: res.tempFilePath,
          encoding: 'base64',
          success: (data) => {
            const arrayBuffer = decode(data.data as string);
            const object = loader.parse(arrayBuffer, '');
            resolve(object);
          },
          fail: (err) => console.log(err)
        });
      }
    });
  });
};
