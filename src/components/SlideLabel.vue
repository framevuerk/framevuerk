<template>
  <button
    :class="[$style.slideLabel, isSelected && 'selected']"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<doc>
@doc @description Use as labels (title bar) inside Slider component. Check Slider component to view example.
@slot default
@prop name* @type String @description Tab unique name.
</doc>

<script>
import { inject, props } from '../utility/vue';

export default {
  ...props({
    value: props.str(),
  }),
  ...inject('$theme', '$slider'),
  computed: {
    isSelected() {
      return this.$slider.current === this.value;
    },
  },
  methods: {
    onClick() {
      this.$slider.setCurrent(this.value);
    },
  },
  style({ className }) {
    const $colors = this.$theme.colors;
    return [
      className('slideLabel', {
        userSelect: 'none',
        flexGrow: 1,
        borderBottomWidth: '3px',
        borderBottomColor: 'transparent',
        height: this.$theme.sizes.height.px,
        fontWeight: 'bold',
        transition: 'border-bottom-color 200ms',
        '&.selected': {
          color: $colors.primary.bg,
          borderBottomColor: $colors.primary.bg,
        },
      }),
    ];
  },
};
</script>
