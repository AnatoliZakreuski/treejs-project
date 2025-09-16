import * as THREE from 'three';

interface WallParams {
  height: number;      // высота стены
  width: number;       // ширина стены (толщина стены)
  depth: number;       // глубина стены (по оси Z)
  offsetX?: number;    // смещение по X (по умолчанию левый край двери)
  offsetY?: number;    // смещение по Y (по умолчанию основание стены в 0)
  color?: number;      // цвет стены
}

export function createWall(params: WallParams): THREE.Mesh {
  const {
    height,
    width,
    depth,
    offsetX = 0,
    offsetY = height / 2,
    color = 0xaaaaaa
  } = params;

  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshStandardMaterial({ color });

  const wall = new THREE.Mesh(geometry, material);
  wall.position.set(offsetX, offsetY, 0);
  wall.castShadow = true;
  wall.receiveShadow = true;

  return wall;
}
