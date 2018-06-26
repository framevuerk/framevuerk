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
    align-items: center;
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

  &,
  &.fv-default {
    @include yiq($bg-color);

    border-bottom: solid 1px contrast($bg-color, 2, hard-dark);
  }

  &.fv-primary {
    @include yiq($primary-color);

    border-bottom: solid 1px contrast($primary-color, 2, hard-dark);
    & .fv-button {
      @include fvButton($primary-color, yiq($primary-color), false);
    }

    & .fv-input {
      @include fvInput($primary-color);
    }
  }

  &.fv-secondary {
    @include yiq($secondary-color);

    border-bottom: solid 1px contrast($secondary-color, 2, hard-dark);
    & .fv-button {
      @include fvButton($secondary-color, yiq($secondary-color), false);
    }

    & .fv-input {
      @include fvInput($secondary-color);
    }
  }
}
</style>
