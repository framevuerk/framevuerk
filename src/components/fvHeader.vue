<template lang="pug">
.fv-header
  header
    slot
</template>

<script>
export default {
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-header {
  @include shadow(bottom);

  z-index: 2;

  & > header {
    width: 100%;
    padding: $padding;
    // align-items: center;
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
    @include yiq($bg-color);

    border-bottom: solid 1px contrast($bg-color, 2, hard-dark);
  }
}
</style>
