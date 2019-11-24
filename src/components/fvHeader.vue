<template lang="pug">
.fv-header(:style="colorsCssVars")
  header
    slot
</template>

<script>
import colorMixin from '../mixins/color.js'

export default {
  mixins: [
    colorMixin({
      color: 'background'
    })
  ]
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';

.fv-header {
  @include shadow(bottom);

  height: fit-content;
  min-height: min-content;
  max-height: max-content;

  & > header {
    width: 100%;
    padding: var(--sizes-space-md);
    display: flex;
    justify-content: space-between;
    overflow: hidden;

    & > * {
      @include nowrap;

      align-self: center;
      max-height: 100%;
      max-width: 100%;
    }
  }

  &:not(.transparent) {
    background-color: var(--color-normal);
    color: var(--color-text);
    border-bottom: solid 1px var(--color-border);
  }
}
</style>
