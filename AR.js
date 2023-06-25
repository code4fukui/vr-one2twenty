import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js"; // for PC
import { ARButton } from "three/addons/webxr/ARButton.js";

export class AR {
  // three var
  //camera, scene, light, renderer, canvas, controls;
  //var meshs = [];
  //var grounds = [];

  async init() {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    
    const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.01, 500);
    //camera.position.set(0, 1.7, 0);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 1.7, -1);
    controls.update();

    const scene = new THREE.Scene();
    this.scene = scene;

    const renderer = new THREE.WebGLRenderer({ canvas, precision: "mediump", antialias: true, alpha: true });
    renderer.xr.enabled = true;
    //renderer.setClearColor(new THREE.Color(0x888888)); // not for AR
    document.body.appendChild(ARButton.createButton(renderer));
    const arbtn = document.getElementById("ARButton");
    if (arbtn) {
      arbtn.style.color = "#000";
      arbtn.style.opacity = 0.8;
    }
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(innerWidth, innerHeight);
    
    const onWindowResize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    };
    addEventListener("resize", onWindowResize, false);

    // controllers
	// line
	const makeLine = (len) => {
		const material = new THREE.LineBasicMaterial({
			//color: 0xff0000, // red
			//color: 0x0000ff, // blue
			color: 0xffffff, // white
		});
		const points = [];
		points.push(new THREE.Vector3(0, 0, 0));
		points.push(new THREE.Vector3(0, 0, -len));
		const geometry = new THREE.BufferGeometry().setFromPoints(points);
		const line = new THREE.Line(geometry, material);
		return line;
	};

  const ctrls = [];
    for (let i = 0; i < 2; i++) {
      const ctrl = renderer.xr.getController(i);
      if (ctrl) {
        this.scene.add(ctrl);
        ctrls.push(ctrl);
        //ctrl.add(makeLine(5));
      }
    }
    this.ctrls = ctrls;


    // physics
    //initOimoPhysics();

    const baseloop = () => {
      if (this.loop) {
        this.loop();
      }
      //updateOimoPhysics();
      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(baseloop);

    if (this.main) {
      this.main();
    }
  }
  async waitSelect() {
    return new Promise(resolve => {
      const funcs = [];
      for (let i = 0; i < this.ctrls.length; i++) {
        const f = e => {
          for (let i = 0; i < this.ctrls.length; i++) {
            this.ctrls[i].removeEventListener("selectstart", f[i]);
          }
          const ctrl = e.target;
          resolve(ctrl);
        };
        funcs.push(f);
        this.ctrls[i].addEventListener("selectstart", f);
      }
    });
  }
}

/*
const tempMatrix = new THREE.Matrix4();
const raycaster = new THREE.Raycaster();
export const getIntersections = (controller, objects) => {
	tempMatrix.identity().extractRotation(controller.matrixWorld);
	raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
	raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
	return raycaster.intersectObjects(objects, false);
};
*/
