<template lang="pug">
.fv-header
  header
    slot
</template>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-header {
  @include shadow(bottom);

  z-index: 2;

  & > header {
    width: 100%;
    padding: #{$padding/1.2} $padding;
    display: flex;
    justify-content: space-between;
    overflow: hidden;

    & > .fv-button,
    & > .fv-title,
    & > .title,
    & > * {
      @include nowrap;

      align-items: center;
      display: flex;
      height: auto;
      // justify-content: center;
      max-height: 100%;
      max-width: 100%;
    }
  }

  &:not(.fv-default) {
    @include yiq($header-bg-color);

    border-bottom: solid 1px contrast($header-bg-color, 2, hard-dark);

    & .fv-button {
      @include fvButton($header-bg-color, yiq($header-bg-color), false);
    }

    & .fv-input {
      @include fvInput($header-bg-color);
    }
  }

  &.fv-default {
    background: transparent;
    border-bottom: solid 1px contrast($bg-color, 2, hard-dark);
  }
}
</style>
