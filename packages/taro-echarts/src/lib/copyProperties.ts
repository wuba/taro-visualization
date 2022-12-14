export default function copyProperties(target: any, source: any) {
  for (const key of Object.getOwnPropertyNames(source)) {
    if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
      const desc = Object.getOwnPropertyDescriptor(source, key);
      // @ts-ignore
      Object.defineProperty(target, key, desc);
    }
  }
}
