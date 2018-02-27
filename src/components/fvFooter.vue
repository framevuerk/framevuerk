<template lang="pug">
footer.fv-footer(:style="{ height: height, maxHeight: height, minHeight: height }")
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

.fv-footer {
  @include shadow(inset-bottom);

  align-items: center;
  bottom: 0;
  border-top: solid 1px $shadow-color;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  padding: $padding-small $padding;
  width: 100%;

  & .fv-title,
  & .title {
    padding: 0 $padding;
    text-align: center;

    & > * {
      @include nowrap;

      margin: 0;
      width: 100%;
    }
  }

  & > *:not(:last-child) {
    margin-#{$block-end}: $padding;
  }
}
</style>
