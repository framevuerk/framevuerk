<template lang="pug">
.fv-loading
  .spinner
</template>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';

.fv-loading {
  display: inline-block;
  min-height: heightSize(md);
  vertical-align: middle;

  & .spinner {
    display: inline-block;
    height: 2.5em;
    width: 2.5em;
    clear: both;
    vertical-align: middle;
    border: 0.4em solid;
    border-left-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-radius: 1.5em;
    animation: fv-loading $transition-speed-slow infinite linear;
  }
}

@keyframes fv-loading {
  from { transform: rotate(0deg); }
  to { transform: rotate(359deg); }
}
</style>
