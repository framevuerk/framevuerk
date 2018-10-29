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
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';

.fv-input {
  @include fvInput($bg-color);

  font-size: fontSize(md);
  min-height: heightSize(md);
  vertical-align: middle;
}
</style>
