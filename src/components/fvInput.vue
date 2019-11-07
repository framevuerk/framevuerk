<template lang="pug">
input.fv-input(:invalid="!fvValidate",
  :value="value",
  @focus="onFocus",
  @blur="onBlur",
  @input="onInput")
</template>

<script>
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
    this.$el.style.setProperty('--pl', `var(--color-${this.color}-placeholder)`)
    this.$el.style.setProperty('--fg', `var(--color-${this.color}-text)`)
    this.$el.style.setProperty('--bg', `var(--color-${this.color}-light)`)
    this.$el.style.setProperty('--border', `var(--color-${this.color}-border)`)
    this.$el.style.setProperty('--border-active', `var(--color-${this.color}-borderhover)`)
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';

.fv-input {
  @include shadow(bottom);
  background: var(--bg);
  color: var(--fg);

  border: solid 1px var(--border);
  border-radius: var(--size-border-radius-normal);
  font-family: inherit;
  position: relative;
  padding: 0 var(--size-padding-small);

  &:not([disabled]) {
    &:hover {
      border: solid 1px var(--border-active);
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
    color: var(--pl);
  }

  font-size: fontSize(md);
  min-height: heightSize(md);
  vertical-align: middle;
}
</style>
