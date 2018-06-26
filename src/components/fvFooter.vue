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
  // $footer-bg-color: #fff;

  @include yiq($footer-bg-color);
  @include shadow(inset-bottom);

  & > footer {
    align-items: center;
    border-top: solid 1px contrast($footer-bg-color, 2, hard-dark);
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    padding: $padding-small $padding;

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
}
</style>
