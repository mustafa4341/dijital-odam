import * as THREE from 'three';
import { scene, camera, controls } from './scene.js?v=106';
import { allMeshes, roomBounds } from './loader.js?v=106';
import { interactiveData } from './config.js?v=106';
import { openModal, isModalOpen, tooltip, isBlockingClicks } from './ui.js?v=106';

export const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let hoveredObject = null;

// Keyboard state
const keysPressed = {};
const velocity = new THREE.Vector3(0, 0, 0);
const friction = 0.95;
const modelScale = 11.4;

const nameContains = (name, pattern) => {
    if (!name) return false;
    const nameLC = name.toLowerCase();
    const patternLC = pattern.toLowerCase();
    return (
        nameLC.includes(patternLC) ||
        nameLC.includes(patternLC.replace('.', '_')) ||
        nameLC.includes(patternLC.replace('.', ''))
    );
};

// ── GET INTERACTIVE ANCESTOR (Whitelist only) ───
export function findInteractiveAncestor(object) {
    let current = object;
    while (current) {
        const nameLC = current.name.toLowerCase();
        
        // Kedi
        if (nameLC.includes('gltf_created_0') || nameLC.includes('object_12') || nameLC.includes('object_14') || nameLC.includes('object_16') || nameLC === 'kedi') {
            return { object: current, key: 'kedi' };
        }
        
        // Yerdeki Eski Bilgisayar (Terminal)
        if (nameContains(nameLC, 'sketchfab_model.012') || nameLC.includes('lowpolypsxoldpc') || nameLC.includes('keyboarde') || nameLC.includes('monitor plainde') || nameLC.includes('mousede') || nameLC.includes('cpu plainde')) {
            return { object: current, key: 'eski_bilgisayar' };
        }
        
        // Robot AI
        if (nameLC.includes('robot') || nameLC.includes('head_headrobot') || nameLC.includes('legsrobot') || nameLC.includes('pcylinder23')) {
            return { object: current, key: 'robot_ai' };
        }

        // Hoparlörler
        if (nameContains(nameLC, 'cube.007') || nameContains(nameLC, 'cube.008') || nameLC === 'circle' || nameLC === 'circle.001') {
            return { object: current, key: 'hoparlor' };
        }

        // Yatak
        if (nameContains(nameLC, 'plane.001') || nameContains(nameLC, 'plane.002') || nameContains(nameLC, 'plane.004') || nameContains(nameLC, 'plane.005') || nameContains(nameLC, 'plane.006')) {
            return { object: current, key: 'yatak' };
        }

        // Gaz Lambası
        if (nameLC.includes('oil_lantern')) {
            return { object: current, key: 'gaz_lambasi' };
        }

        // Kaktüs
        if (nameLC.includes('cactus')) {
            return { object: current, key: 'kaktus' };
        }

        // Dünya (Doğa & Keşif)
        if (nameContains(nameLC, 'globe.002') || nameContains(nameLC, 'globe_objet_0') || nameLC === 'sphere' || nameLC === 'sphere.001') {
            return { object: current, key: 'dunya' };
        }

        // Kahve Kupası
        if (nameLC.includes('cup_0') || nameLC.includes('lid_1') || nameLC.includes('sleeve_2') || nameLC.includes('coffe cup')) {
            return { object: current, key: 'kahve' };
        }

        // Logolar (React, Python, HTML/JS) -> maps to single key 'logolar'
        if (nameLC.includes('react') || nameLC.includes('python') || nameLC.includes('five') || nameLC === 'js' || nameLC === 'js.001' || nameLC === 'js.002' || nameLC === 'js.003') {
            return { object: current, key: 'logolar' };
        }

        // Linux Pengueni (Tux)
        if (nameLC.includes('tux-printable') || nameLC.includes('tux')) {
            return { object: current, key: 'penguen' };
        }

        // Kitaplar
        if (nameLC.includes('brownbook') || nameLC.includes('greenbook') || nameLC.includes('books_magazines')) {
            return { object: current, key: 'kitaplik' };
        }

        // Masaüstü Bilgisayar (Ekran, Klavye, Kasa vb.)
        if (nameContains(nameLC, 'cube.010') || 
            nameContains(nameLC, 'plane.027') || nameContains(nameLC, 'plane.019') || 
            nameContains(nameLC, 'plane.017') || nameContains(nameLC, 'plane.025') ||
            nameContains(nameLC, 'plane.016') || nameContains(nameLC, 'plane.024') ||
            nameContains(nameLC, 'plane.015') || nameContains(nameLC, 'plane.023')) {
            return { object: current, key: 'bilgisayar' };
        }

        // Posterler
        if (nameLC.includes('poster_turk_bayragi')) {
            return { object: current, key: 'poster_bayrak' };
        }
        if (nameLC.includes('poster_baris_manco')) {
            return { object: current, key: 'poster_manco' };
        }
        if (nameLC.includes('poster_yol')) {
            return { object: current, key: 'poster_yol' };
        }

        // Pencere
        if (nameLC.includes('plane.003_1') || nameLC.includes('plane003_1') || nameLC.includes('plane.003_2') || nameLC.includes('plane003_2') || nameLC.includes('window') || nameLC.includes('glass') || nameLC.includes('pencere')) {
            return { object: current, key: 'pencere' };
        }

        current = current.parent;
        if (current === scene) break;
    }
    return null;
}

// ── OUTLINE HIGHLIGHTING ──────────────────────
function highlightObject(object) {
    unhighlightObject(object);
    let target = object.name === 'kedi' ? object.parent : object;

    target.traverse((child) => {
        if (child.isMesh && child.name !== 'kedi') {
            const edgesGeo = new THREE.EdgesGeometry(child.geometry, 15);
            const lineMat = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.9,
                polygonOffset: true,
                polygonOffsetFactor: -1,
                polygonOffsetUnits: -1
            });
            const outline = new THREE.LineSegments(edgesGeo, lineMat);
            outline.name = 'hoverOutline';
            child.add(outline);
        }
    });
}

function unhighlightObject(object) {
    let target = object.name === 'kedi' ? object.parent : object;

    target.traverse((child) => {
        if (child.isMesh) {
            const toRemove = [];
            child.children.forEach(c => {
                if (c.name === 'hoverOutline') toRemove.push(c);
            });
            toRemove.forEach(c => {
                child.remove(c);
                if (c.geometry) c.geometry.dispose();
                if (c.material) c.material.dispose();
            });
        }
    });
}

// ── MOUSE EVENTS ─────────────────────────────
let isDragging = false;
let mouseDownPos = { x: 0, y: 0 };

window.addEventListener('mousedown', (e) => {
    mouseDownPos.x = e.clientX;
    mouseDownPos.y = e.clientY;
    isDragging = false;
});

window.addEventListener('mousemove', (e) => {
    const dx = e.clientX - mouseDownPos.x;
    const dy = e.clientY - mouseDownPos.y;
    if (Math.sqrt(dx*dx + dy*dy) > 5) isDragging = true;
});

export function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (isModalOpen) return;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(allMeshes, false);

    if (intersects.length > 0) {
        const hit = intersects[0].object;
        const interactive = findInteractiveAncestor(hit);

        if (interactive) {
            if (hoveredObject !== hit) {
                if (hoveredObject) unhighlightObject(hoveredObject);
                hoveredObject = hit;
                highlightObject(hoveredObject);
                document.body.classList.add('cursor-pointer');
                document.body.classList.remove('cursor-grab');
            }

            let title = "";
            if (interactive.key === 'eski_bilgisayar') {
                title = "Retro Terminal (Yerdeki PC)";
            } else if (interactive.key === 'robot_ai') {
                title = "AI Asistanı (Robot)";
            } else if (interactiveData[interactive.key]) {
                title = interactiveData[interactive.key].title;
            }

            if (title) {
                tooltip.textContent = title;
                tooltip.classList.add('visible');
                tooltip.style.left = event.clientX + 16 + 'px';
                tooltip.style.top = event.clientY - 10 + 'px';
            } else {
                clearHover();
            }
        } else {
            clearHover();
        }
    } else {
        clearHover();
    }
}

export function clearHover() {
    if (hoveredObject) {
        unhighlightObject(hoveredObject);
        hoveredObject = null;
    }
    document.body.classList.remove('cursor-pointer');
    document.body.classList.add('cursor-grab');
    tooltip.classList.remove('visible');
}

export function onMouseClick(event) {
    if (isModalOpen || isBlockingClicks || isDragging) return;

    const canvas = document.getElementById('three-canvas');
    if (event.target !== canvas) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(allMeshes, false);

    if (intersects.length > 0) {
        const hit = intersects[0].object;
        const interactive = findInteractiveAncestor(hit);

        if (interactive) {
            openModal(interactive.key);
        }
    }
}

// ── TOUCH SUPPORT ────────────────────────────
export function onTouchStart(event) {
    if (event.touches.length === 1 && !isModalOpen && !isBlockingClicks) {
        const touch = event.touches[0];
        mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(allMeshes, false);

        if (intersects.length > 0) {
            const hit = intersects[0].object;
            const interactive = findInteractiveAncestor(hit);
            if (interactive) {
                event.stopPropagation();
                openModal(interactive.key);
            }
        }
    }
}

// ── DOUBLE-CLICK TO FOCUS ────────────────────
export function onDoubleClick(event) {
    if (isModalOpen) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(allMeshes, false);

    if (intersects.length > 0) {
        const point = intersects[0].point;
        const targetPos = point.clone();
        const dir = new THREE.Vector3().subVectors(camera.position, point).normalize();
        const newCamPos = point.clone().add(dir.multiplyScalar(1.5));
        animateCamera(newCamPos, targetPos, 800);
    }
}

function animateCamera(newPos, newTarget, duration) {
    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();
    const startTime = performance.now();

    function update() {
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);

        camera.position.lerpVectors(startPos, newPos, ease);
        controls.target.lerpVectors(startTarget, newTarget, ease);
        controls.update();

        if (t < 1) requestAnimationFrame(update);
    }
    update();
}

// ── KEYBOARD MOVEMENT & CLAMPING ──────────────
window.addEventListener('keydown', (e) => {
    if (isModalOpen) return;
    keysPressed[e.code] = true;
});

window.addEventListener('keyup', (e) => {
    keysPressed[e.code] = false;
});

export function processKeyboardMovement() {
    if (isModalOpen) return;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    const upVec = new THREE.Vector3(0, 1, 0);
    const accel = modelScale * 0.00015;

    if (keysPressed['KeyW'] || keysPressed['ArrowUp']) velocity.addScaledVector(forward, accel);
    if (keysPressed['KeyS'] || keysPressed['ArrowDown']) velocity.addScaledVector(forward, -accel);
    if (keysPressed['KeyA'] || keysPressed['ArrowLeft']) velocity.addScaledVector(right, -accel);
    if (keysPressed['KeyD'] || keysPressed['ArrowRight']) velocity.addScaledVector(right, accel);
    if (keysPressed['KeyQ']) velocity.addScaledVector(upVec, accel);
    if (keysPressed['KeyE']) velocity.addScaledVector(upVec, -accel);

    const mSpeed = modelScale * 0.003;
    if (velocity.length() > mSpeed) velocity.setLength(mSpeed);

    velocity.multiplyScalar(friction);

    if (velocity.length() < 0.0001) {
        velocity.set(0, 0, 0);
        return;
    }

    camera.position.add(velocity);
    controls.target.add(velocity);
    clampCamera();
    controls.update();
}

function clampCamera() {
    if (!roomBounds) return;
    camera.position.x = Math.max(roomBounds.min.x, Math.min(roomBounds.max.x, camera.position.x));
    camera.position.y = Math.max(roomBounds.min.y, Math.min(roomBounds.max.y, camera.position.y));
    camera.position.z = Math.max(roomBounds.min.z, Math.min(roomBounds.max.z, camera.position.z));
    controls.target.x = Math.max(roomBounds.min.x, Math.min(roomBounds.max.x, controls.target.x));
    controls.target.y = Math.max(roomBounds.min.y, Math.min(roomBounds.max.y, controls.target.y));
    controls.target.z = Math.max(roomBounds.min.z, Math.min(roomBounds.max.z, controls.target.z));
}
