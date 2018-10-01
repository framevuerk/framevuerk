<template lang="pug">
.fv-content
  slot
</template>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-content {
  @include scrollbar($bg-color);

  display: block;
  flex-grow: 1;
  overflow: auto;
  width: 100%;

  &::after {
    clear: both;
    content: '';
    display: block;
  }
}
</style>
