# taro-3d

Three component for Taro, support WeChat mini-programs, H5 and React Native application.

## Installing

```
yarn add taro-3d
```

## Basic Usage

```tsx
import { useCallback, useEffect, useState } from 'react';
import {
    AmbientLight,
    Fog,
    GridHelper,
    Mesh,
    PerspectiveCamera,
    PointLight,
    Scene,
    SpotLight,
    BoxGeometry,
    MeshBasicMaterial,
} from 'three';
import {View3D, Renderer} from 'taro-3d'
import {ExpoWebGLRenderingContext} from 'taro-3d/build/main/lib/View3D.types'

export default function TabOneScreen() {
  let timeout:number;

  const [viewHeight, setViewHeight] = useState(500)

  useEffect(() => {
    return () => clearTimeout(timeout);
  }, []);

  const heightClick = useCallback(()=>{
    setViewHeight(viewHeight + 100)
  },[viewHeight]);

  return (
    <>
    <View3D
      style={{ flex: 1, height: viewHeight, with: 500 }}
      onContextCreate={async (gl: ExpoWebGLRenderingContext) => {
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
        const sceneColor = 0x6ad6f0;

        // Create a WebGLRenderer without a DOM element
        const renderer = new Renderer({ gl });
        renderer.setSize(width, height);
        renderer.setClearColor(sceneColor);

        const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
        camera.position.set(2, 5, 5);

        const scene = new Scene();
        scene.fog = new Fog(sceneColor, 1, 10000);
        scene.add(new GridHelper(10, 10));

        const ambientLight = new AmbientLight(0x101010);
        scene.add(ambientLight);

        const pointLight = new PointLight(0xffffff, 2, 1000, 1);
        pointLight.position.set(0, 200, 200);
        scene.add(pointLight);

        const spotLight = new SpotLight(0xffffff, 0.5);
        spotLight.position.set(0, 500, 100);
        spotLight.lookAt(scene.position);
        scene.add(spotLight);

        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const geometry = new BoxGeometry(boxWidth, boxHeight, boxDepth);

        const material = new MeshBasicMaterial({color: 0x44aa88});  // greenish blue

        const cube = new Mesh(geometry, material);
        scene.add(cube);

        camera.lookAt(cube.position);

        function update() {
          cube.rotation.y += 0.05;
          cube.rotation.x += 0.025;
        }

        // Setup an animation loop
        const render = () => {
          timeout = requestAnimationFrame(render);
          update();
          renderer.render(scene, camera);
          gl.endFrameEXP();
        };
        render();
      }}
    />
    </>
  );
}

```
