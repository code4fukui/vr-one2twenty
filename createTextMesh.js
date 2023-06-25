import * as THREE from "three";
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

export const loadFont = async (path) => {
  return new Promise(resolve => {
    const loader = new FontLoader();
    loader.load(path, resolve);
  });
};

// font
// https://threejs.org/docs/#examples/en/geometries/TextGeometry
const base = "https://code4fukui.github.io/three.js_examples/";
const font = await loadFont(base + "fonts/helvetiker_regular.typeface.json");

export const createTextMesh = (str, x, y, z, color = 0xffffff) => {
  const size = .08;
  const geot = new TextGeometry(str, {
    font,
    size,
    height: 0,
    curveSegments: 4,
    /*
    bevelEnabled: true,
    bevelThickness: 10,
    bevelSize: 8,
    bevelOffset: 0,
    bevelSegments: 5,
    */
  });
  const matt = new THREE.MeshBasicMaterial({ color });
  const mesht = new THREE.Mesh(geot, matt);
  geot.computeBoundingBox();
  const b = geot.boundingBox;
  const w = b.max.x - b.min.x;
  const h = b.max.y - b.min.y;
  const d = b.max.z - b.min.z;
  mesht.position.set(x - w / 2, y - h / 2, z); //  - d / 2);
  return mesht;
};
