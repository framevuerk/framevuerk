<template lang="pug">
input.fv-input(:invalid="!fvValidate",
  :value="value",
  @focus="onFocus",
  @blur="onBlur",
  @input="onInput")
</template>

<script>
import config from '../utility/config.js'

export default {
  props: {
    color: {
      type: String,
      default: 'background'
    },
    value: {
      default: undefined
    },
    required: {
      type: [Boolean, Function],
      default: false
    }
  },
  inject: {
    fvFormElement: {
      default: false
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
  },
  methods: {
    focus () {
      this.$el.focus()
    },
    onFocus () {
      this.$el.select()
      if (this.fvFormElement) {
        this.fvFormElement.turn(true)
      }
    },
    onBlur () {
      if (this.fvFormElement) {
        this.fvFormElement.turn(false)
      }
    },
    onInput (event) {
      this.$emit('input', event.target.value)
    }
  },
  mounted() {
    config.bind(this.$el, ['color', this.color])
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';

.fv-input {
  @include shadow(bottom);
  background: var(--b-light);
  color: var(--b-text);
  border: solid 1px var(--b-border);
  border-radius: var(--size-border-radius-normal);
  font-family: inherit;
  position: relative;
  padding: 0 var(--size-padding-small);
  font-size: fontSize(md);
  min-height: heightSize(md);
  vertical-align: middle;

  &:not([disabled]) {
    &:hover {
      border: solid 1px var(--b-borderhover);
    }

    &:focus,
    &[focus] {
      @include outline;

      &:invalid,
      &[invalid] {
        border: solid 1px var(--color-danger-normal);
      }
    }
  }

  &[disabled] {
    @include disabled;
  }

  &::placeholder,
  & > .placeholder {
    color: var(--b-placeholder);
  }
}
</style>
