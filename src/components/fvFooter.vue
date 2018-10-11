<template lang="pug">
.fv-footer
  footer
    slot
</template>

<script>
export default {
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-footer {
  @include shadow(inset-bottom);

  height: fit-content;
  min-height: min-content;
  max-height: max-content;
  overflow: auto;

  & > footer {
    padding: #{$padding/1.2} $padding;
  }

  &:not(.fv-default) {
    @include yiq($footer-bg-color);

    border-top: solid 1px contrast($footer-bg-color, 2, hard-dark);
  }

  &.fv-default {
    background: transparent;
    border-top: solid 1px contrast($bg-color, 2, hard-dark);
  }
}
</style>
