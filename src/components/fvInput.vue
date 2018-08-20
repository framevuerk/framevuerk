<template lang="pug">
input.fv-input(:invalid="!fvValidate",
  :value="value",
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
}
</style>
