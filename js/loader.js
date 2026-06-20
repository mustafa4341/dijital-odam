import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { scene } from './scene.js?v=106';

export const animationState = { mixer: null };
export const rotatingObjects = [];
export const allMeshes = [];
export let roomBounds = {
    min: new THREE.Vector3(-15, -5, -15),
    max: new THREE.Vector3(15, 15, 15)
};

const cloneMaterialSafely = (material) => {
    if (!material) return null;
    if (Array.isArray(material)) {
        return material.map(m => m ? m.clone() : null);
    }
    return material.clone();
};

const getSingleMaterial = (material) => {
    if (!material) return null;
    if (Array.isArray(material)) {
        return material[0];
    }
    return material;
};

// ── LIGHTING (Add to scene) ───────────────────
const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(4, 10, 6);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 4096;
dirLight.shadow.mapSize.height = 4096;
dirLight.shadow.bias = -0.0005;
dirLight.shadow.normalBias = 0.02;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 60;
dirLight.shadow.camera.left = -15;
dirLight.shadow.camera.right = 15;
dirLight.shadow.camera.top = 15;
dirLight.shadow.camera.bottom = -15;
scene.add(dirLight);

const dirLight2 = new THREE.DirectionalLight(0xc8d8ff, 0.4);
dirLight2.position.set(-6, 6, -4);
scene.add(dirLight2);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
fillLight.position.set(-3, 4, -2);
scene.add(fillLight);

// ── TEXTURE GENERATORS ───────────────────────
function createConcreteTexture() {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#c8c4bc';
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < 60000; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const v = Math.floor(170 + (Math.random() - 0.5) * 40);
        ctx.fillStyle = `rgba(${v}, ${v - 5}, ${v - 10}, 0.18)`;
        ctx.fillRect(x, y, 1, 1);
    }
    for (let i = 0; i < 3000; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = 1 + Math.random() * 3;
        const dark = Math.random() > 0.6;
        ctx.fillStyle = dark ? 'rgba(80,75,70,0.07)' : 'rgba(255,255,250,0.08)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
}

function createFabricTexture() {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1e1e24';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    for (let i = 0; i < size; i += 2) ctx.fillRect(i, 0, 1, size);
    for (let j = 0; j < size; j += 2) ctx.fillRect(0, j, size, 1);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(12, 12);
    return texture;
}

function createLightFabricTexture() {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f5f4f0';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
    for (let i = 0; i < size; i += 2) ctx.fillRect(i, 0, 1, size);
    for (let j = 0; j < size; j += 2) ctx.fillRect(0, j, size, 1);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(12, 12);
    return texture;
}

// ── LOAD MODEL ───────────────────────────────
export function loadModel(onSuccess, onProgress, onError) {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/libs/draco/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(
        'mustafa_oda.glb',
        (gltf) => {
            const model = gltf.scene;

            model.traverse((child) => {
                child.updateWorldMatrix(true, false);
                const worldPos = new THREE.Vector3();
                child.getWorldPosition(worldPos);

                const childName = (child.name || '').toLowerCase();
                const parentName = child.parent ? (child.parent.name || '').toLowerCase() : '';

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

                // Visibility override for hidden objects
                if (!child.visible) {
                    const isPlane020TopLevel = (nameContains(childName, 'plane.020') || nameContains(childName, 'plane020')) &&
                        !nameContains(parentName, 'plane.013') && !nameContains(parentName, 'plane013');
                    const isReflectionPlane = nameContains(childName, 'reflectionplane');
                    const isHugeScale = Math.max(Math.abs(child.scale.x), Math.abs(child.scale.y), Math.abs(child.scale.z)) > 50;
                    const hasMat022 = child.isMesh && (() => {
                        const ms = Array.isArray(child.material) ? child.material : [child.material];
                        return ms.some(m => m && (m.name === 'Material.022' || m.name === 'Material_022' || m.name === 'Material022'));
                    })();
                    const shouldStayHidden = isPlane020TopLevel || isReflectionPlane || (isHugeScale && childName.includes('plane')) || hasMat022;
                    if (!shouldStayHidden) {
                        child.visible = true;
                    }
                }

                // Hide planes & reflection
                if ((nameContains(childName, 'plane.020') || nameContains(childName, 'plane020')) &&
                    !nameContains(parentName, 'plane.013') && !nameContains(parentName, 'plane013')) {
                    child.visible = false;
                }
                const scaleMax = Math.max(Math.abs(child.scale.x), Math.abs(child.scale.y), Math.abs(child.scale.z));
                if (scaleMax > 50 && childName.includes('plane')) {
                    child.visible = false;
                }
                if (child.isMesh) {
                    const mats = Array.isArray(child.material) ? child.material : [child.material];
                    mats.forEach(m => {
                        if (m && (m.name === 'Material.022' || m.name === 'Material_022' || m.name === 'Material022')) {
                            child.visible = false;
                        }
                    });
                }
                if (nameContains(childName, 'reflectionplane')) {
                    child.visible = false;
                }

                // Rug and desk tweaks (Z-fighting fixes)
                if (child.isMesh) {
                    const mat = child.material;
                    const matName = mat ? (mat.name || '') : '';
                    if (matName === 'Material.014' || matName === 'Material_014' || matName === 'Material014') {
                        child.position.y = 0.05;
                        child.updateMatrix();
                    }
                }
                if (nameContains(childName, 'cube.009') || nameContains(childName, 'cube009')) {
                    child.position.y += 0.01;
                    child.updateMatrix();
                }
                if (nameContains(childName, 'sketchfab_model.012')) {
                    child.position.y = 0.35;
                    child.updateMatrix();
                }

                // Bed materials
                if (child.isMesh) {
                    const isBedFrame = nameContains(childName, 'plane.001');
                    const isBedSheet = nameContains(childName, 'plane.002');
                    const isDuvet = nameContains(childName, 'plane.004');
                    const isPillow = nameContains(childName, 'plane.005') || nameContains(childName, 'plane.006');

                    if (isBedFrame || isBedSheet || isDuvet || isPillow) {
                        child.material = cloneMaterialSafely(child.material);
                        const mat = getSingleMaterial(child.material);
                        if (isBedFrame) {
                            mat.map = createFabricTexture();
                            mat.color.setHex(0x121214);
                            mat.roughness = 0.95;
                        } else if (isDuvet) {
                            mat.map = createFabricTexture();
                            mat.color.setHex(0x282830);
                            mat.roughness = 0.9;
                        } else if (isBedSheet || isPillow) {
                            mat.map = createLightFabricTexture();
                            mat.color.setHex(0xffffff);
                            mat.roughness = 0.85;
                        }
                        mat.needsUpdate = true;
                    }
                }

                // Curtains texture
                if (child.isMesh && (nameContains(childName, 'plane.008') || nameContains(childName, 'plane008') || nameContains(childName, 'plane.010') || nameContains(childName, 'plane010'))) {
                    child.material = cloneMaterialSafely(child.material);
                    const mat = getSingleMaterial(child.material);
                    try {
                        const curtainTex = new THREE.TextureLoader().load('curtain_texture.png');
                        curtainTex.wrapS = THREE.RepeatWrapping;
                        curtainTex.wrapT = THREE.RepeatWrapping;
                        curtainTex.repeat.set(1.5, 1);
                        curtainTex.colorSpace = THREE.SRGBColorSpace;
                        mat.map = curtainTex;
                    } catch (e) {
                        console.error(e);
                    }
                    mat.color.setHex(0xffffff);
                    mat.roughness = 0.95;
                    mat.needsUpdate = true;
                }

                // Window frames transparency
                if (child.isMesh) {
                    if (nameContains(childName, 'plane003_1') || nameContains(childName, 'plane.003_1')) {
                        child.material = cloneMaterialSafely(child.material);
                        const mat = getSingleMaterial(child.material);
                        mat.map = null;
                        mat.transparent = true;
                        mat.opacity = 0.0;
                        mat.needsUpdate = true;
                    } else if (nameContains(childName, 'plane003_2') || nameContains(childName, 'plane.003_2')) {
                        child.material = cloneMaterialSafely(child.material);
                        const mat = getSingleMaterial(child.material);
                        mat.map = null;
                        mat.needsUpdate = true;
                    }
                }

                // Cat collider
                if (nameContains(childName, 'gltf_created_0')) {
                    const sphereGeo = new THREE.SphereGeometry(8.0, 16, 16);
                    const sphereMat = new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        transparent: true,
                        opacity: 0.0,
                        depthWrite: false,
                        colorWrite: false
                    });
                    const collider = new THREE.Mesh(sphereGeo, sphereMat);
                    collider.name = 'kedi';
                    collider.position.set(3.5, 0.5, 4.5);
                    collider.renderOrder = -1;
                    child.add(collider);
                    allMeshes.push(collider);
                }

                if (child.isMesh) {
                    const isLogo = 
                        childName.includes('react') || parentName.includes('react') ||
                        childName.includes('five') || parentName.includes('five') ||
                        childName.includes('js') || parentName.includes('js') ||
                        childName.includes('python') || parentName.includes('python');
                    const isRug = nameContains(childName, 'plane.014');
                    child.castShadow = true;
                    child.receiveShadow = (isLogo || isRug) ? false : true;

                    // Ground dark planes hiding
                    const dist = worldPos.length();
                    const isCatModelPart = childName.includes('joint') || childName.includes('j_') || childName.includes('cat') || childName.includes('gltf_created_0') || childName.includes('object_12') || childName.includes('object_14') || childName.includes('object_16') || childName.includes('object_0') || childName.includes('object_1') || childName.includes('object_2');
                    const mat0 = Array.isArray(child.material) ? child.material[0] : child.material;
                    const meshScaleMax = Math.max(Math.abs(child.scale.x), Math.abs(child.scale.y), Math.abs(child.scale.z));

                    if (meshScaleMax > 50) {
                        child.visible = false;
                    }

                    const isGroundLevelDarkPlane = worldPos.y < 0.15 &&
                        child.name && child.name.toLowerCase().includes('plane') &&
                        childName !== 'plane' &&
                        mat0 && !mat0.map &&
                        mat0.color && mat0.color.r < 0.15 && mat0.color.g < 0.15 && mat0.color.b < 0.15 &&
                        !nameContains(childName, 'plane.001') &&
                        !nameContains(childName, 'plane.004') &&
                        !nameContains(childName, 'plane.014') &&
                        !nameContains(childName, 'plane.003');
                    if (isGroundLevelDarkPlane) {
                        child.visible = false;
                    }

                    const isOuterStaticObject = !isCatModelPart && (nameContains(childName, 'globe.002') || nameContains(childName, 'scene.002')) && dist > 4.5;
                    if (isOuterStaticObject) {
                        child._staticPosition = child.position.clone();
                        child._staticRotation = child.rotation.clone();
                        child._staticScale = child.scale.clone();
                        child._isStaticOuterObject = true;
                        child.matrixAutoUpdate = false;
                        child.updateMatrix();
                    }

                    // Materials adjustments
                    const materials = Array.isArray(child.material) ? child.material : [child.material];
                    materials.forEach((mat) => {
                        if (mat) {
                            mat.side = THREE.DoubleSide;

                            const isChairWhiteMat = mat.name === 'Material.019' || mat.name === 'Material_019' || mat.name === 'Material019';
                            if (isChairWhiteMat) {
                                mat.color.setHex(0x7f8c8d);
                                mat.roughness = 0.65;
                                mat.metalness = 0.1;
                                mat.needsUpdate = true;
                            }

                            const matNameLC2 = (mat.name || '').toLowerCase().replace(/[._]/g, '');
                            const isWallMat = 
                                matNameLC2 === 'material003' || matNameLC2 === 'material001' ||
                                mat.name === 'Material.003' || mat.name === 'Material_003' ||
                                mat.name === 'Material.001' || mat.name === 'Material_001';
                            if (isWallMat) {
                                try {
                                    const wallTex = new THREE.TextureLoader().load('Popcorn-texture-scaled.jpeg');
                                    wallTex.wrapS = THREE.RepeatWrapping;
                                    wallTex.wrapT = THREE.RepeatWrapping;
                                    wallTex.repeat.set(4, 4);
                                    wallTex.colorSpace = THREE.SRGBColorSpace;
                                    mat.map = wallTex;
                                } catch (e) {
                                    mat.map = createConcreteTexture();
                                }
                                mat.color.setHex(0xffffff);
                                mat.roughness = 0.95;
                                mat.needsUpdate = true;
                            }

                            const isFloorMat = 
                                mat.name === 'Material.013' || mat.name === 'Material_013' || mat.name === 'Material013';
                            if (isFloorMat) {
                                try {
                                    const floorTex = new THREE.TextureLoader().load('floor_wood_parquet.png');
                                    floorTex.wrapS = THREE.RepeatWrapping;
                                    floorTex.wrapT = THREE.RepeatWrapping;
                                    floorTex.repeat.set(4, 4);
                                    floorTex.colorSpace = THREE.SRGBColorSpace;
                                    mat.map = floorTex;
                                } catch (e) {
                                    console.error(e);
                                }
                                mat.color.setHex(0xffffff);
                                mat.emissive.setHex(0x3e3e3e);
                                mat.emissiveIntensity = 0.4;
                                mat.roughness = 0.45;
                                mat.needsUpdate = true;
                            }

                            const isCactusMat = mat.name && mat.name.toLowerCase().includes('cactus');
                            if (isCactusMat) {
                                if (!mat.map) mat.color.setHex(0x2d5a27);
                                mat.roughness = 0.85;
                                mat.needsUpdate = true;
                            }

                            if (isLogo && mat.color) {
                                mat.emissive = mat.color.clone();
                                mat.emissiveIntensity = 0.45;
                            }

                            const isPCMaterial = mat.name && (
                                mat.name.toLowerCase().includes('material.035') ||
                                mat.name.toLowerCase().includes('material.036') ||
                                mat.name.toLowerCase().includes('material.037') ||
                                mat.name.toLowerCase().includes('material.038')
                            );
                            if (isPCMaterial) {
                                child.receiveShadow = false;
                                if (mat.map) {
                                    mat.emissiveMap = mat.map;
                                    mat.emissive = new THREE.Color(0xffffff);
                                    mat.emissiveIntensity = 0.45;
                                } else {
                                    mat.emissive = mat.color ? mat.color.clone() : new THREE.Color(0xffffff);
                                    mat.emissiveIntensity = 0.45;
                                }
                            }

                            const isRobotMaterial = mat.name && (
                                mat.name.toLowerCase().includes('robot') || 
                                mat.name.toLowerCase().includes('screen')
                            );
                            if (isRobotMaterial) {
                                child.receiveShadow = false;
                                if (mat.map) {
                                    mat.emissiveMap = mat.map;
                                    mat.emissive = new THREE.Color(0xffffff);
                                    mat.emissiveIntensity = 0.45;
                                } else {
                                    mat.emissive = mat.color ? mat.color.clone() : new THREE.Color(0xffffff);
                                    mat.emissiveIntensity = 0.45;
                                }
                            }

                            const isRugMaterial = mat.name === 'Material.014' || mat.name === 'Material_014' || mat.name === 'Material014';
                            if (isRugMaterial) {
                                try {
                                    const rugTex = new THREE.TextureLoader().load('zebra_carpet.png');
                                    rugTex.wrapS = THREE.RepeatWrapping;
                                    rugTex.wrapT = THREE.RepeatWrapping;
                                    rugTex.repeat.set(1.5, 1.5);
                                    rugTex.colorSpace = THREE.SRGBColorSpace;
                                    mat.map = rugTex;
                                    mat.emissiveMap = rugTex;
                                    mat.emissive = new THREE.Color(0x222222);
                                    mat.emissiveIntensity = 0.15;
                                } catch (e) {
                                    console.error(e);
                                }
                                mat.color.setHex(0xffffff);
                                mat.roughness = 0.95;
                                mat.needsUpdate = true;
                            }

                            if (!isCatModelPart && mat.transparent && mat.opacity < 0.1) {
                                mat.opacity = 1.0;
                                mat.transparent = false;
                            }
                            if (mat.alphaTest > 0.9) mat.alphaTest = 0.5;
                            if (mat.metalness === undefined) mat.metalness = 0.0;
                            if (mat.roughness === undefined) mat.roughness = 0.8;
                            mat.needsUpdate = true;
                        }
                    });

                    const isCatHelperSphere = childName.includes('object_16') || childName.includes('plane_2') || childName.includes('object_2');
                    if (!isCatHelperSphere) {
                        allMeshes.push(child);
                    }
                }

                if (child.isLight) {
                    child.intensity *= 1.0;
                }
            });

            scene.add(model);

            // Doğa Manzarası (Window View)
            try {
                const natureGeo = new THREE.PlaneGeometry(5.0, 2.8);
                const natureTex = new THREE.TextureLoader().load('nature_window_view.png');
                natureTex.colorSpace = THREE.SRGBColorSpace;
                const natureMat = new THREE.MeshBasicMaterial({
                    map: natureTex,
                    side: THREE.DoubleSide
                });
                const naturePlane = new THREE.Mesh(natureGeo, natureMat);
                naturePlane.position.set(-4.45, 2.41, -0.01);
                naturePlane.rotation.y = Math.PI / 2;
                scene.add(naturePlane);
            } catch (e) {
                console.error(e);
            }

            // Framed Posters Creation
            const dynamicTexLoader = new THREE.TextureLoader();
            const createFramedPoster = (width, height, texturePath, posX, posY, posZ, groupName) => {
                const group = new THREE.Group();
                group.name = groupName;

                // Frame
                const frameGeo = new THREE.PlaneGeometry(width + 0.08, height + 0.08);
                const frameMat = new THREE.MeshStandardMaterial({
                    color: 0x111111,
                    roughness: 0.9,
                    metalness: 0.2,
                    side: THREE.DoubleSide
                });
                const frameMesh = new THREE.Mesh(frameGeo, frameMat);
                frameMesh.name = groupName + '_frame';
                frameMesh.castShadow = true;
                frameMesh.receiveShadow = true;
                group.add(frameMesh);
                allMeshes.push(frameMesh);

                // Poster
                const posterGeo = new THREE.PlaneGeometry(width, height);
                const tex = dynamicTexLoader.load(texturePath);
                tex.colorSpace = THREE.SRGBColorSpace;
                if (groupName === 'poster_turk_bayragi') {
                    tex.rotation = Math.PI / 2;
                    tex.wrapS = THREE.RepeatWrapping;
                    tex.repeat.x = -1;
                    tex.center.set(0.5, 0.5);
                }
                const posterMat = new THREE.MeshStandardMaterial({
                    map: tex,
                    roughness: 0.8,
                    metalness: 0.15,
                    side: THREE.DoubleSide
                });
                const posterMesh = new THREE.Mesh(posterGeo, posterMat);
                posterMesh.name = groupName + '_image';
                posterMesh.position.set(0, 0, 0.005);
                posterMesh.castShadow = true;
                posterMesh.receiveShadow = true;
                group.add(posterMesh);
                allMeshes.push(posterMesh);

                group.position.set(posX, posY, posZ);
                model.add(group);
            };

            createFramedPoster(3.40, 1.90, 'turk_bayragi.jpg', -1.95, 4.90, -5.68, 'poster_turk_bayragi');
            createFramedPoster(2.00, 2.70, 'baris_manco.jpeg', -3.05, 2.25, -5.68, 'poster_baris_manco');
            createFramedPoster(2.00, 2.70, 'neon_yol.jpg', -0.85, 2.25, -5.68, 'poster_neon_yol');

            // Animations setup
            if (gltf.animations && gltf.animations.length > 0) {
                animationState.mixer = new THREE.AnimationMixer(model);
                gltf.animations.forEach((clip) => {
                    clip.tracks = clip.tracks.filter(track => {
                        const trackName = track.name.toLowerCase();
                        const isOuterObject = 
                            trackName.includes('globe.002') || trackName.includes('globe_002') || trackName.includes('globe002') ||
                            trackName.includes('scene.002') || trackName.includes('scene_002') ||
                            trackName.includes('holosupport.002') || trackName.includes('holosupport_002');
                        return !isOuterObject;
                    });
                    if (clip.tracks.length > 0) {
                        animationState.mixer.clipAction(clip).play();
                    }
                });
            }

            // Hologram rotation collection
            model.traverse((child) => {
                if (!child.isMesh) return;
                const name = (child.name || '').toLowerCase();
                const parentName = (child.parent?.name || '').toLowerCase();

                const isGlobe = (
                    (parentName.includes('holo') || name.includes('holo')) &&
                    (name.includes('sphere') || name.includes('globe') || name.includes('earth') || name.includes('dünya'))
                );
                const isDirectGlobe = name.includes('globe') || name.includes('earth') || name === 'sphere';

                if (isGlobe || isDirectGlobe) {
                    if (!child._isStaticOuterObject) {
                        rotatingObjects.push(child);
                    }
                }
            });

            onSuccess(model);
        },
        onProgress,
        onError
    );
}
