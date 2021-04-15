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
  name: 'SlideContent',
  inject: ['$theme', '$slider'],
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
  },
  mounted() {
    this.$slider.slides.push(this.value);
  },
  beforeUnmount() {
    this.$slider.slides.splice(this.$slider.slides.indexOf(this.value), 1);
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
