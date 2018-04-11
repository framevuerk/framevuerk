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

@mixin button($color, $outline: false, $active-color: false) {
  $outline-color: if($outline, $outline, $color);
  $active-color: if($active-color, $active-color, $outline-color);

  background-color: $bg-color;
  color: $color;
  border: 1px solid darken($bg-color-light, $shadow-percent);

  &:hover {
    background-color: yiq($bg-color, 2%);
  }

  &:focus {
    @if $bg-color == $color {
      background-color: yiq($bg-color, 2%);
    }

    @else {
      background-color: yiq($bg-color, 2%);
    }

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
