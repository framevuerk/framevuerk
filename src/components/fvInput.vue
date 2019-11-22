<template lang="pug">
component.fv-input(
  :is="tag",
  :class="{ multiline: multiline }",
  :style="colorsCssVars",
  :disabled="disabled",
  :invalid="!fvValidate",
  :value="value",
  @focus="onFocus",
  @blur="onBlurDefault",
  @input="onInput")
</template>

<script>
import parent from '../utility/parent.js'
import config from '../utility/config.js'
import colorMixin from '../mixins/color.js'
import formElementMixin from '../mixins/formElement.js'

export default {
  mixins: [
    colorMixin({
      color: 'background'
    }),
    formElementMixin(v => !!v)
  ],
  props: {
    multiline: {
      type: Boolean,
      default: false
    },
    autoHeight: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    tag () {
      return this.multiline ? 'textarea' : 'input'
    }
  },
  methods: {
    onFocus () {
      this.$el.select()
      this.onFocusDefault()
    },
    onInput (event) {
      if (this.autoHeight && this.multiline) {
        this.$el.style.height = '2.8em'
        this.$el.style.height = `${this.$el.scrollHeight - 2}px`
      }
      this.$emit('input', event.target.value)
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';

.fv-input {
  @include shadow(bottom);
  background: var(--color-light);
  color: var(--color-text);
  border: solid 1px var(--color-border);
  border-radius: var(--size-border-radius-normal);
  font-family: inherit;
  position: relative;
  padding: 0 var(--size-padding-small);
  font-size: fontSize(md);
  min-height: heightSize(md);
  line-height: 1.5;
  vertical-align: middle;

  &.multiline {
    height: 2.8em;
    overflow: hidden;
    padding: 0.7em var(--size-padding-small);
    resize: none;
  }

  &:not([disabled]) {
    &:hover {
      border: solid 1px var(--color-borderhover);
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
    color: var(--color-placeholder);
  }
}
</style>
