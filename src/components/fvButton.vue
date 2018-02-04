<template lang="pug">
button.fv-button(:class="{'loading': loading}", @click="onClick", :disabled="disabled || loading")
  i(:class="icon", v-if="icon && !loading")
  =" "
  slot(v-if="typeof text === 'undefined' && !loading")
  span(v-else-if="!loading",
    v-html="text")
  i.loading-icon.fa.fa-spin.fa-circle-o-notch.fv-fast-animation(v-else)
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

@mixin button($bgcolor, $color: false) {
  $bgcolor-light: lighten($bgcolor, $highlight-percent-light);
  $bgcolor-dark: darken($bgcolor, $shadow-percent);

  background: $bgcolor;
  border: 1px solid $bgcolor-dark;

  @if $color == false {
    color: yiq($bgcolor);
  }

  @else {
    color: $color;
  }

  &:hover {
    background: yiq($bgcolor, 2%);
  }

  &:active {
    background: yiq($bgcolor, 5%);
  }

  &:focus {
    &:not(.text-focus) {
      @include respond-to(md) {
        @if $bg-color == $bgcolor {
          @include outline;
        }

        @else {
          @include outline($bgcolor);
        }
      }
    }

    &.text-focus {
      @include respond-to(md) {
        @include textoutline;
      }
    }

    &:invalid,
    &[invalid] {
      @include outline($danger-color);
    }
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

  &,
  & span {
    @include nowrap;
  }

  &,
  &.fv-default {
    @include button($bg-color);
  }

  &.fv-ok {
    @include button($bg-color, $primary-color);
  }

  &.fv-primary {
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
