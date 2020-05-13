<template>
  <div :class="$style.slideContent">
    <slot />
  </div>
</template>

<doc>
@doc @description Use as contents of slides inside Slider component. Check Slider component to view example.
@slot default
@prop name* @type String @description Tab unique name.
</doc>

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
