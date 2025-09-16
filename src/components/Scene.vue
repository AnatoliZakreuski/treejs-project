<script lang="ts" setup>
import * as THREE from 'three';
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createDoor } from './objects/createDoor';
import { createWall } from './objects/createMirror';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';

// --- Пропсы для компонента ---
interface SceneProps {
  doorWidth: number;
  doorHeight: number;
  lightPosition: number; // можно использовать для регулировки радиуса орбиты
}
const props = defineProps<SceneProps>();

// Ссылка на контейнер канваса
const container = ref<HTMLElement | null>(null);

// THREE объекты
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let door: THREE.Object3D;
let directionalLight: THREE.DirectionalLight;

let clock = new THREE.Clock(); // для анимации света

// --- Инициализация сцены ---
onMounted(() => {
  if (!container.value) return;

  initScene();
  initCamera();
  initRenderer();
  initControls();
  initLights();
  initObjects();
  animate();

  window.addEventListener('resize', onResize);
});

// Очистка ресурсов
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
  renderer.dispose();
  controls.dispose();
});

// --- Функции инициализации ---
function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);
}

function initCamera() {
  if (!container.value) return;
  camera = new THREE.PerspectiveCamera(
    75,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  );
  camera.position.set(5, 5, 10);
}

function initRenderer() {
  if (!container.value) return;
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  renderer.shadowMap.enabled = true;
  container.value.appendChild(renderer.domElement);
}

function initControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
}

function initLights() {
  directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
}

function initObjects() {
  // Куб
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  cube.position.set(-3, 1, 0);
  cube.castShadow = true;
  scene.add(cube);

  // Сфера
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x0000ff })
  );
  sphere.position.set(3, 1.5, 0);
  sphere.castShadow = true;
  scene.add(sphere);

  // Пол
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshStandardMaterial({ color: 0x999999 })
  );
  plane.rotation.x = -Math.PI / 2;
  plane.receiveShadow = true;
  scene.add(plane);

  // Дверь
  door = createDoor();
  scene.add(door);

  const updateDoorScale = (width: number, height: number) => {
    if (!door) return;

    door.scale.set(width, height, 1);

    const box = new THREE.Box3().setFromObject(door);
    const minY = box.min.y;
    door.position.y -= minY;
    door.position.z = 5;
  };

  updateDoorScale(props.doorWidth, props.doorHeight);

  watch(
    () => [props.doorWidth, props.doorHeight],
    () => {
      updateDoorScale(props.doorWidth, props.doorHeight);
    }
  );
  


  const geometry = new THREE.PlaneGeometry(10, 10); // размер зеркала
  const mirror = new Reflector(geometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x889999
  });

  const box = new THREE.Box3().setFromObject(mirror);
  const minY = box.min.y;
  mirror.position.set(0, -minY, 8); // позиция зеркала
  mirror.rotateY(Math.PI);         // при необходимости поворот
  scene.add(mirror);
}

// --- Анимация ---
function animate() {
  requestAnimationFrame(animate);

  // Преобразуем часы в угол: 0h = -90° (ночь), 12h = 90° (полдень)
  const angle = (props.lightPosition / 24) * Math.PI * 2 - Math.PI / 2;

  const radius = 10; // радиус орбиты
  directionalLight.position.set(
    Math.cos(angle) * radius,       // x
    Math.sin(angle) * radius + 5,   // y
    Math.sin(angle) * radius        // z
  );

  directionalLight.lookAt(0, 0, 0);

  controls.update();
  renderer.render(scene, camera);
}

// --- Обработка ресайза ---
function onResize() {
  if (!container.value) return;

  const width = container.value.clientWidth;
  const height = container.value.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}
</script>

<template>
  <div ref="container" style="width: 100%; height: 100%;"></div>
</template>
