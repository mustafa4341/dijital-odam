import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2a2a3e);

export const clock = new THREE.Clock();

export const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.05,
    1000
);
camera.position.set(5.0, 5.5, 7.5);

const canvas = document.getElementById('three-canvas');

export const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
    logarithmicDepthBuffer: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

export const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.15;
controls.zoomSpeed = 0.4;
controls.enablePan = false;
controls.minDistance = 0.5;
controls.maxDistance = 35;
controls.maxPolarAngle = Math.PI * 0.95;
controls.minPolarAngle = 0.05;
controls.screenSpacePanning = false;

const roomCenter = new THREE.Vector3(-1.2, 1.2, 0.65);
controls.target.copy(roomCenter);
controls.update();

// Track control state for cursor changes
controls.addEventListener('start', () => {
    document.body.classList.add('cursor-grabbing');
    document.body.classList.remove('cursor-grab');
});
controls.addEventListener('end', () => {
    document.body.classList.remove('cursor-grabbing');
    document.body.classList.add('cursor-grab');
});

// Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
