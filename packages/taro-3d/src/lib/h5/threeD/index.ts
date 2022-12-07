import { Group } from 'three';

export { TextureLoader } from 'three';

export const loadAsync = (loader: any, url: string): Promise<Group> => {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (res: Group) => resolve(res),
      () => {},
      (error: Error) => reject(error)
    );
  });
};
