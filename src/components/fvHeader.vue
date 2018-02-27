<template lang="pug">
header.fv-header(:style="{ height: height, maxHeight: height, minHeight: height }")
  slot
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: '65px'
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-header {
  @include shadow(bottom);

  align-items: center;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  border-bottom: solid 1px $shadow-color;
  right: 0;
  top: 0;
  transition-duration: $transition-speed;
  transition-property: height;
  width: 100%;
  padding: 0 $padding;
  z-index: 2;

  & > .fv-button,
  & > .fv-title,
  & > .title,
  & > * {
    @include nowrap;

    align-items: center;
    display: flex;
    height: auto;
    justify-content: center;
    max-height: 100%;
    max-width: 100%;
  }

  & > .fv-title,
  & > .title {
    flex-direction: column;
    flex-grow: 1;
    line-height: 1.3;

    & > * {
      margin: 0;
      padding: 0;
      width: 100%;
    }
  }

  & > .space {
    width: $padding;
  }
}
</style>
