<template>
    <div class="app-panel" :class="{ 'app-panel--collapsed': panelIsCollapsed }">
        Hello
    </div>
</template>

<script>
export default {
  name: 'AppPane',
  props: {
    panelIsCollapsed: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
.app-panel {
  position: fixed;
  z-index: 1;
  z-index: 2;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 66vh;
  overflow: hidden;
  transform: translateY(0);
  transition: transform 0.35s cubic-bezier(0.25, 0.8, 0.5, 1);
  background-color: #fff;
  box-shadow: 0 -2px 8px 0px rgba(0, 0, 0, .3);
}

.app-panel--collapsed {
  transform: translateY(100%);
}

.app-panel__minimize {
  position: absolute;
  top: 0;
  right: 0;
  margin: 8px;
}
</style>
