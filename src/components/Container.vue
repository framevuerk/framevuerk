<template>
<div :class="$style.container">
  <slot />
</div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
    },
    padding: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: false,
    },
  },
  style({ className }) {
    return [
      className('container', {
        background: this.color ? this.$theme.colors[this.color].normal : 'inherit',
        color: this.color ? this.$theme.colors[this.color].text : 'inherit',
        boxShadow: this.border ? `0 ${this.$theme.sizes.shadow.normal} ${this.$theme.sizes.shadow.normal} ${this.$theme.colors.background.shade(-50, 0.2)}` : 'none',
        border: this.border ? `solid 1px ${this.$theme.colors.background.shade(-15)}` : 'none',
        borderRadius: this.border ? this.$theme.sizes.radius.normal : 0,
        padding: this.padding ? this.$theme.sizes.base.normal : 'none',
      }),
    ];
  },
  inject: ['$theme'],
};
</script>
