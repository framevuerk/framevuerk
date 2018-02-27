<template lang="pug">
button.fv-button(:class="{'loading': loading}", @click="onClick", :disabled="disabled || loading")
  i.icon(:class="icon", v-if="icon && !loading")
  =" "
  span.text(v-if="typeof text === 'undefined' && !loading")
    slot
  span.text(v-else-if="!loading",
    v-html="text")
  i.icon.loading-icon.fa.fa-spin.fa-circle-o-notch.fv-fast-animation(v-else)
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    icon: {
      default: ''
    },
    text: {
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClick (e) {
      if (!this.loading && !this.disabled) {
        this.$emit('click', e)
      }
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';

@mixin button($color, $outline: false, $active-color: false) {
  $outline-color: if($outline, $outline, $color);
  $active-color: if($active-color, $active-color, $outline-color);

  background-color: $bg-color;
  color: $color;
  border: 1px solid darken($bg-color-light, $shadow-percent);

  &:focus {
    &:not(.text-focus) {
      @if $bg-color == $color {
        @include outline;
      }

      @else {
        @include outline($outline-color);
      }
    }

    &.text-focus {
      @include textoutline;
    }

    &:invalid,
    &[invalid] {
      @include outline($danger-color);
    }
  }

  &:hover:not(:invalid):not([invalid]):not([disabled]) {
    background-color: yiq($bg-color, 2%);
  }

  &:active:not(:invalid):not([invalid]):not([disabled]) {
    background-color: $active-color;
    color: yiq($active-color);
  }

  &[disabled] {
    @include disabled;
  }
}

.fv-button {
  @include shadow(bottom);
  @include sizes;

  border-radius: $border-radius;
  cursor: pointer;
  display: inline-block;
  font-family: inherit;
  max-width: 100%;
  text-align: center;
  padding: 0 $padding;
  transition-duration: $transition-speed-fast;
  transition-property: background-color, color;

  &,
  & .text,
  & .icon {
    @include nowrap;
    vertical-align: middle;
  }

  &,
  &.fv-default {
    @include button(yiq($bg-color), $primary-color, yiq($bg-color, 10%));
  }

  &.fv-primary,
  &.fv-ok {
    @include button($primary-color);
  }

  &.fv-info {
    @include button($info-color);
  }

  &.fv-danger {
    @include button($danger-color);
  }

  &.fv-warning {
    @include button($warning-color);
  }
}
</style>
