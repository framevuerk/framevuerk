<template lang="pug">
.fv-main
  slot
</template>

<script>
export default {
  props: {
    parent: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-main {
  @include yiq($bg-color);

  direction: $direction;
  display: flex;
  flex-direction: column;
  height: inherit;
  position: relative;
  width: inherit;
}
</style>
