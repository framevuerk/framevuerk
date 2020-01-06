<template>
<component :is="tag" :class="$style.button" @click="onClick" :disabled="disabled" :to="$attrs.to">
  <template>
    <slot />
  </template>
</component>
</template>

<script>
import color from '../mixins/color';
import size from '../mixins/size';

export default {
  mixins: [color, size],
  props: {
    tag: {
      type: String,
      default: 'button',
    },
    fab: {
      type: Boolean,
      default: false,
    },
    invert: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClick(event) {
      if (!this.loading && !this.disabled) {
        this.$emit('click', event);
      }
    },
  },
  style({ className }) {
    return [
      className('button', {
        display: 'inline-block',
        backgroundColor: this.invert ? 'transparent' : this.$color.normal,
        color: this.$color[this.invert ? 'normal' : 'text'],
        boxShadow: this.$theme.sizes.shadow.factor(this.$size, 'shadow', { dir: 'bottom' }),
        borderStyle: 'solid',
        borderWidth: '1px',
        fontWeight: 'bold',
        textAlign: 'center',
        borderColor: this.$color.shade(-13),
        borderRadius: this.$theme.sizes.radius.factor(this.fab ? 'round' : this.$size, 'radius'),
        lineHeight: this.$theme.sizes.base.factor(this.$size, 'height'),
        minHeight: this.$theme.sizes.base.factor(this.$size, 'height'),
        height: this.$theme.sizes.base.factor(this.$size, 'height'),
        fontSize: this.$theme.sizes.font.factor(this.$size, 'font'),
        width: this.fab ? this.$theme.sizes.base.factor(this.$size, 'height') : 'auto',
        padding: this.fab ? '0' : `0 ${this.$theme.sizes.base.multiplyBy(2)}`,
        transition: `all ${this.$theme.speed.normal}`,
        cursor: 'pointer',
        overflow: 'hidden',
        textDecoration: 'blink',
        userSelect: 'none',
        '&:hover, &:focus': {
          backgroundColor: this.$color.autoShade(10, this.invert ? 0.1 : 1),
        },
        '&:active': {
          backgroundColor: this.$color.autoShade(-15, this.invert ? 0.2 : 1),
        },
      }),
    ];
  },
  inject: ['$theme'],
};
</script>