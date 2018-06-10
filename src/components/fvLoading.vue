<template lang="pug">
.fv-loading
</template>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';
.fv-loading {
  display: inline-block;
  width: 1.3em;
  height: 1.3em;
  clear: both;
  border: 2px solid;
  vertical-align: middle;
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-radius: 0.7em;
  animation: fv-loading $transition-speed-slow infinite linear;
}

@keyframes fv-loading {
  from { transform: rotate(0deg); }
  to { transform: rotate(359deg); }
}
</style>
