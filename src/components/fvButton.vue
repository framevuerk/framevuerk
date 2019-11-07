<template lang="pug">
component.fv-button(:is="tag", :class="{'loading': loading}", @click="onClick", :disabled="disabled")
  template
    slot
  fv-loading(v-if="loading")
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'background'
    },
    tag: {
      type: String,
      default: 'button'
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClick (event) {
      if (!this.loading && !this.disabled) {
        this.$emit('click', event)
      }
    }
  },
  mounted() {
    this.$el.style.setProperty('--fg', `var(--color-${this.color}-text)`)
    this.$el.style.setProperty('--bg', `var(--color-${this.color}-normal)`)
    this.$el.style.setProperty('--bg-hover', `var(--color-${this.color}-hover)`)
    this.$el.style.setProperty('--bg-active', `var(--color-${this.color}-active)`)
    this.$el.style.setProperty('--border', `var(--color-${this.color}-border)`)
  }
}
</script>

<style lang="scss">
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
  border-radius: var(--size-border-radius-normal);
  font-family: inherit;
  max-width: 100%;
  text-align: center;
  font-weight: bold;
  padding: 0 var(--size-padding-normal);
  transition-duration: var(--speed-transition-fast);
  transition-property: background-color, color, box-shadow;
  border: none;
  user-select: none;
  background-color: var(--bg);
  color: var(--fg);
  border: solid 1px var(--border);

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
      background: var(--bg-hover);
    }
    &:active {
      background: var(--bg-active);
    }
  }
  &[disabled] {
    @include disabled;
  }

  &.loading {
    color: var(--bg);

    & > .fv-loading {
      color: var(--fg);
      position: absolute;
      box-shadow: 0 0 5px white;
      background: var(--bg);
      box-shadow: 0 0 0 0.1em var(--bg);
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
</style>
