import { scene, camera, renderer, controls, clock } from './js/scene.js?v=107';
import { loadModel, animationState, rotatingObjects } from './js/loader.js?v=107';
import { onMouseMove, onMouseClick, onTouchStart, onDoubleClick, processKeyboardMovement } from './js/interaction.js?v=107';
import './js/terminal.js?v=107';

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const hintOverlay = document.getElementById('hint-overlay');

// Load Model & setup
loadModel(
    (model) => {
        setTimeout(() => {
            if (loadingScreen) loadingScreen.classList.add('hidden');
            setTimeout(() => {
                if (hintOverlay) hintOverlay.classList.add('hidden');
            }, 6000);
        }, 500);
    },
    (progress) => {
        if (progress.total > 0 && progressText && progressBar) {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            progressBar.style.width = percent + '%';
            progressText.textContent = percent + '%';
        }
    },
    (error) => {
        console.error('Model loading error:', error);
        if (progressText) {
            progressText.textContent = 'Hata! Konsolu kontrol edin.';
            progressText.style.color = '#fda4af';
        }
    }
);

// Event Bindings
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', onMouseClick, false);
window.addEventListener('dblclick', onDoubleClick, false);

const canvas = document.getElementById('three-canvas');
if (canvas) {
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('dragstart', (e) => e.preventDefault());
    canvas.addEventListener('selectstart', (e) => e.preventDefault());
}

// Animation Render Loop
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // Update GLTF animations
    if (animationState.mixer) {
        animationState.mixer.update(delta);
    }

    // Freeze outer static objects
    scene.traverse((child) => {
        if (child._isStaticOuterObject) {
            child.position.copy(child._staticPosition);
            child.rotation.copy(child._staticRotation);
            child.scale.copy(child._staticScale);
            child.updateMatrix();
        }
    });

    // Rotate globe hologram
    rotatingObjects.forEach(obj => {
        obj.rotation.y += delta * 0.8;
    });

    // Keyboard physics updates
    processKeyboardMovement();

    // Orbit controls updates
    controls.update();
    renderer.render(scene, camera);
}

// Start viewport loop
animate();