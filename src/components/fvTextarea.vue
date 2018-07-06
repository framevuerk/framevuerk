<template lang="pug">
textarea.fv-textarea.fv-input(:class="{'auto-height': autoHeight}",
  :invalid="!fvValidate",
  :value="value",
  :style="{ height: height }"
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
    autoHeight: {
      type: Boolean,
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
          height = this.value.split('\n').length + 1
        } else {
          height = 2
        }
        return `${height * 1.3}em`
      }
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-textarea {
  @include scrollbar($bg-color);

  line-height: 1.3em;
  padding: $padding-small;

  &.auto-height {
    overflow-x: auto;
    overflow-y: hidden;
    resize: none;
  }
}
</style>
