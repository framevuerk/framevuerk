<template lang="pug">
.fv-content
  slot
</template>

<script>
export default {
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-content {
  display: block;
  flex-grow: 1;
  overflow: auto;
  padding: $padding;
  width: 100%;

  &::after {
    clear: both;
    content: '';
    display: block;
  }
}
</style>
