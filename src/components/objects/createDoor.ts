import * as THREE from 'three';

// ---- Рамка двери ----
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x5a3310 });
    const frameThickness = 0.05;

    export function createDoor(): THREE.Group {
    const doorGroup = new THREE.Group();

// ---- Основная плоскость двери ----
    const doorBaseGeometry = new THREE.BoxGeometry(1, 2, 0.05);
    const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const doorBase = new THREE.Mesh(doorBaseGeometry, woodMaterial);
    doorBase.castShadow = true;
    doorGroup.add(doorBase);

    const frameParts = [
        [1, frameThickness, 0.1, 0, 1 - frameThickness / 2, 0],   // верхняя
        [1, frameThickness, 0.1, 0, -1 + frameThickness / 2, 0],  // нижняя
        [frameThickness, 2, 0.1, -0.5 + frameThickness / 2, 0, 0], // левая
        [frameThickness, 2, 0.1, 0.5 - frameThickness / 2, 0, 0],  // правая
    ];

    frameParts.forEach(([w, h, d, x, y, z]) => {
        doorGroup.add(createFramePart(w, h, d, x, y, z));
    });

// ---- Панели двери ----
    const topPanel = createPanel(0, 0.5, 0.015);
    const bottomPanel = createPanel(0, -0.5, 0.015);

    doorGroup.add(topPanel, bottomPanel);

// ---- Ручка ----
    const handleFront = createHandle(0.4, 0, 0.05);
    const handleBack = createHandle(0.4, 0, -0.05);

    doorGroup.add(handleFront);
    doorGroup.add(handleBack);

    return doorGroup;
}

function createHandle(x: number, y: number, z: number) {
    const handleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.15, 16);
    const handleMaterial = new THREE.MeshStandardMaterial({ color: 0xd4af37 });

    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.rotation.z = Math.PI / 2;
    handle.position.set(x, y, z);
    handle.castShadow = true;
    return handle;
}

function createPanel(x: number, y: number, z: number) {
    const panelGeometry = new THREE.BoxGeometry(0.7, 0.6, 0.1);
    const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x754c24 });

    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.set(x, y, z);
    panel.castShadow = true;

    return panel;
}

function createFramePart(width: number, height: number, depth: number, x: number, y: number, z: number) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const mesh = new THREE.Mesh(geometry, frameMaterial);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    return mesh;
}
