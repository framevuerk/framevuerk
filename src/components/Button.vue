<template>
  <component
    :is="tag"
    :class="[$style.button, loading && 'loading']"
    :disabled="disabled || null"
    @click.capture="onClick"
  >
    <div class="content">
      <slot />
    </div>
    <fvLoading
      v-if="loading"
      :css-color="cssColor"
      :css-size="$size"
      class="loading"
    />
  </component>
</template>

<docs src="./‌Button.html" />

<script>
import { inject, props } from '../utility/vue';
import color from '../mixins/color';
import size from '../mixins/size';

export default {
  ...inject('$theme'),
  mixins: [color('primary'), size],
  emits: ['click'],
  ...props({
    tag: props.any('button'),
    fab: props.bool(false),
    invert: props.bool(false),
    disabled: props.bool(false),
    loading: props.bool(false),
  }),
  methods: {
    onClick(event) {
      if (!this.loading && !this.disabled) {
        this.$emit('click', event);
      } else {
        event.preventDefault();
        event.stopPropagation();
      }
    },
  },
  style({ className }) {
    const $color = this.$theme.colors[this.$color];
    const $sizes = this.$theme.sizes;
    const height = this.$theme.sizes.height.factor(this.$size);
    return [
      className('button', {
        font: 'inherit',
        verticalAlign: 'middle',
        display: 'inline-block',
        position: 'relative',
        backgroundColor: this.invert ? 'transparent' : $color.bg,
        color: $color[this.invert ? 'bg' : 'fg'],
        boxShadow: $sizes.shadow.factor('md', 'bottom'),
        borderWidth: '1px',
        fontWeight: 'bold',
        textAlign: 'center',
        borderColor: $color.shade(-15),
        borderRadius: $sizes.radius.factor(this.fab ? 'round' : 'md'),
        lineHeight: height,
        minHeight: height,
        height,
        fontSize: $sizes.font.factor(this.$size),
        width: this.fab ? height : 'auto',
        padding: this.fab ? '0' : `0 ${$sizes.space.px}`,
        transition: `all ${this.$theme.speed.ms}`,
        cursor: 'pointer',
        overflow: 'hidden',
        textDecoration: 'blink',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        '&[disabled]': {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
        '&.loading > .content': {
          opacity: 0,
        },
        '&.loading > .loading': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(0.7)',
          color: $color.text,
        },
        '&:not([disabled])': {
          '&:hover, &:focus': {
            backgroundColor: $color.autoShade(10, this.invert ? 0.1 : 1),
          },
          '&:active': {
            backgroundColor: $color.autoShade(-15, this.invert ? 0.2 : 1),
          },
        },
      }),
    ];
  },
};
</script>
