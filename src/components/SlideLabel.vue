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
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  inject: ['$theme', '$slider'],
  computed: {
    isSelected() {
      return this.$slider && this.$slider.current === this.name;
    },
  },
  methods: {
    onClick() {
      this.$slider.setCurrent(this.name);
    },
  },
  style({ className }) {
    return [
      className('slideLabel', {
        userSelect: 'none',
        flexGrow: 1,
        borderBottomWidth: '3px',
        borderBottomColor: 'transparent',
        height: this.$theme.sizes.base.factor('md', 'height'),
        fontWeight: 'bold',
        transition: 'border-bottom-color 200ms',
        '&.selected': {
          color: this.$theme.colors.primary.normal,
          borderBottomColor: this.$theme.colors.primary.normal,
        },
      }),
    ];
  },
};
</script>
