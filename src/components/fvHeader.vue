<template lang="pug">
.fv-header
  header
    slot
</template>

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
    padding: padding(md);
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
    @include yiq($header-bg-color);

    border-bottom: solid 1px contrast($header-bg-color, 2, hard-dark);

    & .fv-button {
      @include fvButton($header-bg-color, yiq($header-bg-color), false);
    }

    & .fv-input {
      @include fvInput($header-bg-color);
    }
  }

  &.transparent {
    background: transparent;
    border-bottom: solid 1px contrast($bg-color, 2, hard-dark);
  }
}
</style>
