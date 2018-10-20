<template lang="pug">
button.fv-button(:class="{'loading': loading}", @click="onClick", :disabled="disabled || loading")
  template(v-if="!loading")
    slot
  fv-loading(v-else)
</template>

<script>
export default {
  props: {
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
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';

.fv-button {
  font-size: fontSize(md);
  height: heightSize(md);
  min-height: heightSize(md);
  line-height: heightSize(md);
  border-radius: $border-radius;
  cursor: pointer;
  display: inline-block;
  font-family: inherit;
  max-width: 100%;
  text-align: center;
  font-weight: bold;
  padding: 0 $padding;
  transition-duration: $transition-speed-fast;
  transition-property: background-color, color, box-shadow;
  border: none;
  user-select: none;

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

  &,
  &.fv-default {
    @include fvButton($bg-color, yiq($bg-color));
  }

  &.fv-primary {
    @include fvButton($primary-color, yiq($primary-color));
  }

  &.fv-secondary {
    @include fvButton($secondary-color, yiq($secondary-color));
  }

  &.fv-info {
    @include fvButton($info-color, yiq($info-color));
  }

  &.fv-danger {
    @include fvButton($danger-color, yiq($danger-color));
  }

  &.fv-warning {
    @include fvButton($warning-color, yiq($warning-color));
  }
}
</style>
