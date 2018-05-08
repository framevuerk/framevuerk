<template lang="pug">
button.fv-button(:class="{'loading': loading}", @click="onClick", :disabled="disabled || loading")
  i.icon(:class="icon", v-if="icon && !loading")
  =" "
  span.text(v-if="!loading")
    | {{text}}
    slot
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

@mixin button($clr, $outline: false, $active-color: false, $invert: false) {
  $outline-color: if($outline, $outline, $clr);
  $background: if($invert, $clr, $bg-color);
  $active-color: if($invert, yiq($background, 10%), if($active-color, $active-color, $outline-color));
  $color: if($invert, yiq($clr), $clr);

  background-color: $background;
  color: $color;
  border: 1px solid darken($bg-color-light, $shadow-percent);

  &:hover {
    background-color: yiq($background, 2%);
  }

  &:focus {
    background-color: yiq($background, 2%);

    &:invalid,
    &[invalid] {
      @include outline($danger-color);
    }
  }

  &:active:not([disabled]) {
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
  font-weight: bold;
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

    &.invert {
      @include button($primary-color, false, false, true);
    }
  }

  &.fv-secondary {
    @include button($secondary-color);

    &.invert {
      @include button($secondary-color, false, false, true);
    }
  }

  &.fv-info {
    @include button($info-color);

    &.invert {
      @include button($info-color, false, false, true);
    }
  }

  &.fv-danger {
    @include button($danger-color);

    &.invert {
      @include button($danger-color, false, false, true);
    }
  }

  &.fv-warning {
    @include button($warning-color);

    &.invert {
      @include button($warning-color, false, false, true);
    }
  }
}
</style>
