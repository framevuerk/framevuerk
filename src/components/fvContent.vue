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
    height: 9px;
    width: 9px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: contrast($bg-color, 2);
    border: solid 2px $bg-color;
  }

  // &:hover {
  //   &::-webkit-scrollbar-thumb {
  //     background: contrast($bg-color, 2);
  //   }
  // }
}
</style>
