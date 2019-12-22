<template>
<component :is="tag" :class="$style.button" @click="onClick" :disabled="disabled">
  <template>
    <slot />
  </template>
  <!-- fv-loading(v-if="loading") -->
</component>
</template>

<script>
import color from '@/mixins/color';

export default {
  mixins: [color],
  props: {
    border: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'md',
      validator: (v) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(v),
    },
    tag: {
      type: String,
      default: 'button',
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
    const sizeFactorMap = {
      xs: 1,
      sm: 3,
      md: 5,
      lg: 7,
      xl: 9,
    };
    return [
      className('button', {
        background: this.$color.normal,
        color: this.$color.text,
        boxShadow: this.border ? `0 ${this.$theme.sizes.shadow.normal} ${this.$theme.sizes.shadow.normal} ${this.$theme.colors.background.shade(-50, 0.2)}` : 'none',
        borderStyle: 'solid',
        borderWidth: this.border ? '1px' : '0',
        fontWeight: 'bold',
        borderColor: this.$color.shade(-8),
        borderRadius: this.$theme.sizes.radius.normal,
        minHeight: this.$theme.sizes.base.normal,
        height: this.$theme.sizes.base.multiplyBy(5),
        padding: `0 ${this.$theme.sizes.base.multiplyBy(2)}`,
        transition: `all ${this.$theme.speed.normal}`,
        cursor: 'pointer',
        '&:hover, &:focus': {
          background: this.$color.shade(5),
        },
        '&:active': {
          background: this.$color.shade(-5),
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
