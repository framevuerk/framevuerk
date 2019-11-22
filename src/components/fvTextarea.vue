<template lang="pug">
//- remove in 3
textarea.fv-textarea.fv-input(:class="{'auto-height': autoHeight}",
  :invalid="!fvValidate",
  :value="value",
  :style="{ height: height }",
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
    },
    autoHeight: {
      type: Boolean,
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
        if (!this.value) {
          return false
        } else {
          return true
        }
      } else if (typeof this.required === 'function') {
        return this.required(this.value)
      }
      return true
    },
    height () {
      if (this.autoHeight) {
        let height
        if (this.value) {
          height = this.value.split('\n').length + 2
        } else {
          height = 2
        }
        return `${height * 1.3}em`
      }
    }
  },
  methods: {
    focus () {
      this.$el.focus()
    },
    onFocus () {
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
@import '../styles/mixins';

.fv-textarea {
  line-height: 1.3em;
  font-size: fontSize(md);
  min-height: heightSize(md);
  resize: vertical;
  padding: var(size-padding-small);

  &.auto-height {
    overflow-x: auto;
    overflow-y: hidden;
    resize: none;
    transition: height 0.1s;
  }
}
</style>
