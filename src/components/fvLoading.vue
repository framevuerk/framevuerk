<template lang="pug">
.fv-loading
  .spinner
</template>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';

.fv-loading {
  display: inline-block;
  height: 1.6em;
  width: 1.6em;
  vertical-align: middle;

  & .spinner {
    display: inline-block;
    height: 1.6em;
    width: 1.6em;
    clear: both;
    vertical-align: middle;
    border: 0.15em solid;
    border-left-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-radius: 0.9em;
    animation: fv-loading $transition-speed-slow infinite linear;
  }
}

@keyframes fv-loading {
  from { transform: rotate(0deg); }
  to { transform: rotate(359deg); }
}
</style>
