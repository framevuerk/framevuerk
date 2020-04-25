<template>
  <div :class="$style.slideContent">
    <slot />
  </div>
</template>

<script>
export default {
  inject: ['$theme'],
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  style({ className }) {
    return [
      className('slideContent', {
        userSelect: 'none',
        overflowX: 'hidden',
        flexGrow: 1,
        flexBasis: 0,
        flexShrink: 1,
        padding: this.$theme.sizes.base.normal,
      }),
    ];
  },
};
</script>
