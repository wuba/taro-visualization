import { Canvas } from '@tarojs/components';
import Taro from '@tarojs/taro';
import * as React from 'react';
import { useEffect } from 'react';
import {
  AmbientLight,
  BoxGeometry,
  Fog,
  GridHelper,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
  WebGLRenderer
} from 'three';
export interface IProps {
  canvasId?: string;
}
const View3D = (props: IProps) => {
  let timeout: number;
  useEffect(() => {
    const query = Taro.createSelectorQuery();
    query
      .select(`#${props.canvasId ?? 'view3d'}`)
      .node()
      .exec((res) => {
        const canvas = res[0].node;
        const gl = canvas.getContext('webgl');
        // console.log(1111, canvas, gl)
        // gl.clearColor(1, 0, 1, 1)
        // gl.clear(gl.COLOR_BUFFER_BIT)
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
        const sceneColor = 0x6ad6f0;

        const renderer = new WebGLRenderer({ context: gl });
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

        const material = new MeshBasicMaterial({ color: 0x44aa88 }); // greenish blue

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
      });
    return () => clearTimeout(timeout);
  }, []);
  return <Canvas canvasId={props.canvasId ?? 'view3d'} id={props.canvasId ?? 'view3d'} type="webgl" />;
};

export default {
  View3D,
  Renderer: WebGLRenderer
};
