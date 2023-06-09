import { useEffect, useRef } from 'react';
import './EarthSphere.css';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import EarthSkin from '../../assets/images/earthskin.jpg';
import { gsap } from 'gsap';
import { getEarthModel } from '../../utils/earthModel';
import { getDeviceWidthAndHeight, isRunningOnMobileDevice } from '../../utils/domUtils';

function EarthSphere() {
  const mountRef = useRef(null);
  const NAVBAR_HEIGHT = 32;
  const Earth = getEarthModel();

  const _deviceSize = getDeviceWidthAndHeight();

  const screenSize = {
    height: _deviceSize.height - NAVBAR_HEIGHT,
    width: _deviceSize.width
  };

  const popOutEarthAnimation = (mesh) => {
    const earthTl = gsap.timeline({ defaults: {duration: 1}});
    earthTl.from(mesh.scale, { z: 0, y : 0, x: 0 }, { z: 1, y : 1, x: 1 });
  }

  const adjustCameraPosition = (camera,screenSize) =>{
    if(isRunningOnMobileDevice()){
      // for mobile screens
      camera.position.z = 15;
    } else { 
      // for other screens
      camera.position.z = 14;
    }
  }

  // create a scene
  const scene = new THREE.Scene()

  scene.add(Earth);

  // lights
  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(10, 10, 10);
  scene.add(light);

  // ambient lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  light.position.set(10, 10, 10);
  scene.add(ambientLight);

  // add camera
  const camera = new THREE.PerspectiveCamera(45, screenSize.width / screenSize.height, 2, 100);
  adjustCameraPosition(camera, screenSize);
  scene.add(camera);

  // render on canvas
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(screenSize.width, screenSize.height);
  renderer.setPixelRatio(3);
  renderer.render(scene, camera);
  popOutEarthAnimation(Earth)

  // orbit control
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.autoRotate = true;
  controls.rotateSpeed = 5;

  function loop() {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
  }

  loop();

  useEffect(() => {
    mountRef?.current?.appendChild(renderer.domElement);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => mountRef?.current?.removeChild(renderer.domElement);
  },[]);

  useEffect(() => {
    function handleResize() {
      const _deviceSize = getDeviceWidthAndHeight();
      // eslint-disable-next-line no-const-assign
      screenSize.height = _deviceSize.height - NAVBAR_HEIGHT;
      screenSize.width = _deviceSize.width;

      adjustCameraPosition(camera, screenSize);

      camera.aspect = screenSize.width / screenSize.height;
      camera.updateProjectionMatrix();
      renderer.setSize(screenSize.width, screenSize.height);
    }

    window.addEventListener('resize', handleResize)

    return _ => {
      window.removeEventListener('resize', handleResize)

    }
  });

  return (
    <div className="earth-sphere" ref={mountRef}></div>
  );
}

export default EarthSphere;
