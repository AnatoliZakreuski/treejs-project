<script setup>
import Scene from './components/Scene.vue';
import { ref, computed } from 'vue';

const doorWidth = ref(2);
const doorHeight = ref(3);
const lightPosition = ref(12); // часы от 0 до 24

// Вычисляемые свойства для отображения
const doorWidthLabel = computed(() => Number(doorWidth.value).toFixed(1));
const doorHeightLabel = computed(() => Number(doorHeight.value).toFixed(1));
</script>

<template>
  <div class="app-container">
    <div class="scene-container">
      <Scene
        class="canvas"
        :door-width="doorWidth"
        :door-height="doorHeight"
        :light-position="lightPosition"
      />
    </div>

    <div class="right-panel">
      <div>
        <h2>Изменить дверь</h2>

        <div class="door-setting">
          <div class="door-setting-labels">
            <span class="label-text">Ширина:</span>
            <span class="label-value">{{ doorWidthLabel }}</span>
          </div>
          <input type="range" min="0.5" max="5" step="0.1" v-model.number="doorWidth" />
        </div>

        <div class="door-setting">
          <div class="door-setting-labels">
            <span class="label-text">Высота:</span>
            <span class="label-value">{{ doorHeightLabel }}</span>
          </div>
          <input type="range" min="1" max="5" step="0.1" v-model.number="doorHeight" />
        </div>
      </div>

      <div>
        <h2>Время суток</h2>
        <div class="door-setting">
          <div class="door-setting-labels">
            <span class="label-text">Часы:</span>
            <span class="label-value">{{ lightPosition }}</span>
          </div>
          <input type="range" min="0" max="24" step="0.1" v-model.number="lightPosition" />
        </div>
      </div>
    </div>
  </div>
</template>


<style>
html, body, #app { margin:0; padding:0; width:100%; height:100%; }
.app-container { display:flex; width:100vw; height:100vh; }
.scene-container { flex:7; position:relative; top:0; left:0; }
.right-panel { flex:3; min-width:250px; background-color:#150707; padding:1rem; color:#fff; box-sizing:border-box; }
@media (max-width:800px) { .app-container { flex-direction:column; } .scene-container, .right-panel { flex:none; width:100%; height:50vh; } }
.door-setting { display:flex; align-items:center; gap:1rem; margin-bottom:1rem; }
.door-setting-labels { display:flex; gap:0.5rem; width:100px; justify-content:space-between; flex-shrink:0; }
.label-text { white-space:nowrap; }
.label-value { text-align:right; }
.door-setting input[type="range"] { flex:1; }
</style>
