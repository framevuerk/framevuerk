<template>
<component :is="tag" :class="$style.button" @click="onClick" :disabled="disabled" :to="$attrs.to">
  <template>
    <slot />
  </template>
  <!-- fv-loading(v-if="loading") -->
</component>
</template>

<script>
import color from '@/mixins/color';
import size from '@/mixins/size';

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

<zstyle lang="scss">
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';

.fv-button {
  @include shadow(bottom);

  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  font-size: fontSize(md);
  height: heightSize(md);
  min-height: heightSize(md);
  border-radius: var(--sizes-radius-md);
  font-family: inherit;
  max-width: 100%;
  text-align: center;
  font-weight: bold;
  padding: 0 var(--sizes-space-md);
  transition-duration: var(--speed-fast);
  transition-property: background-color, color, box-shadow;
  border: none;
  user-select: none;
  background-color: var(--color-normal);
  color: var(--color-text);
  border: solid 1px var(--color-border);

  &,
  & .text,
  & .icon {
    @include nowrap;

    vertical-align: middle;

    & > svg {
      vertical-align: middle;
      height: fontSize(lg);
    }
  }

  & > * {
    margin: 0 0.4em;
  }


  &:not([disabled]):not(.loading) {
    cursor: pointer;

    &:hover,
    &:focus {
      background: var(--color-hover);

      &:focus {
        border-color: var(--color-borderhover);
      }
    }
    &:active {
      background: var(--color-active);
    }
  }
  &[disabled] {
    @include disabled;
  }

  &.loading {
    color: var(--color-normal);

    & > .fv-loading {
      color: var(--color-text);
      position: absolute;
      box-shadow: 0 0 5px white;
      background: var(--color-normal);
      box-shadow: 0 0 0 0.1em var(--color-normal);
      margin: 0;
    }
  }
  // &,
  // &.fv-default {
  //   @include fvButton($bg-color, yiq($bg-color));
  // }

  // &.fv-primary {
  //   @include fvButton($primary-color, yiq($primary-color));
  // }

  // &.fv-secondary {
  //   @include fvButton($secondary-color, yiq($secondary-color));
  // }

  // &.fv-info {
  //   @include fvButton($info-color, yiq($info-color));
  // }

  // &.fv-danger {
  //   @include fvButton($danger-color, yiq($danger-color));
  // }

  // &.fv-warning {
  //   @include fvButton($warning-color, yiq($warning-color));
  // }
}
</stylez>
