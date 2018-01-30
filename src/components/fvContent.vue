<template lang="pug">
.fv-content
  slot
</template>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-content {
  display: block;
  flex-grow: 1;
  overflow: auto;
  padding: $padding;
  width: 100%;

  &::after {
    clear: both;
    content: '';
    display: block;
  }

  &::-webkit-scrollbar {
    height: 12px;
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: $bg-color;
  }

  &::-webkit-scrollbar-thumb {
    background: $bg-color-dark;
    border: solid 2px $bg-color;
  }
}
</style>
