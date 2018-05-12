<template lang="pug">
input.fv-input(ref="inputEl",
  :disabled="disabled",
  :invalid="!fvValidate",
  :value="value",
  :placeholder="placeholder",
  @input="$emit('input', $event.target.value)")
</template>

<script>
export default {
  props: {
    value: {
      default: undefined
    },
    required: {
      type: [Boolean, Function],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  computed: {
    fvValidate () {
      if (this.required === true) {
        return !!this.value
      } else if (typeof this.required === 'function') {
        return this.required(this.value)
      }
      return true
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';

.fv-input {
  @include yiq($bg-color-light);
  @include shadow(bottom);
  @include sizes;

  border: 1px solid darken($bg-color-light, $shadow-percent);
  border-radius: $border-radius;
  font-family: inherit;
  position: relative;
  padding: 0 $padding-small;

  &:focus,
  &[focus] {
    @include outline;

    &:invalid,
    &[invalid] {
      @include outline($danger-color);
    }
  }

  &[disabled] {
    @include disabled;
  }

  &::placeholder {
    color: $gray-color-dark;
  }
}
</style>
