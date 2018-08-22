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
  @include yiq($footer-bg-color);
  @include shadow(inset-bottom);

  border-top: solid 1px contrast($footer-bg-color, 2, hard-dark);
  height: auto;
  overflow: auto;

  & > footer {
    padding: #{$padding/1.2} $padding;
  }
}
</style>
