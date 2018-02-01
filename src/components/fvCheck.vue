<template lang="pug">
.fv-check
  span.fv-check-item(:tabindex="disabled || option.disabled? '': 0",
    v-for="option in options",
    ref="option",
    @click="selectOption(option)",
    @keydown.enter.space.prevent="selectOption(option)",
    :class="{'checked': isChecked(option), 'disabled': optionProp(option, 'disabled') || disabled || false}",
    :invalid="!fvValidate")
    i.fv-check-icon.fa(v-if="multiple",
      :class="{'fa-square-o': !isChecked(option), 'fa-check-square': isChecked(option)}")
    i.fv-check-icon.fa(v-else,
      :class="{'fa-circle-o': !isChecked(option), 'fa-dot-circle-o': isChecked(option)}")
    =" "
    label.fv-control-label(v-html="optionProp(option, 'text')")
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    disabledKey: {
      type: String,
      default: 'disabled'
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    textKey: {
      type: String,
      default: 'text'
    },
    value: {
      default: undefined
    },
    multiple: {
      type: Boolean,
      default: false
    },
    required: {
      type: [Boolean, Function],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isValid: true
    }
  },
  computed: {
    fvValidate () {
      if (this.required === true) {
        if (this.multiple) {
          return this.value && this.value.constructor === Array && this.value.length
        } else {
          return !!this.value
        }
      } else if (typeof this.required === 'function') {
        return this.required()
      }
      return true
    }
  },
  methods: {
    focus () {
      this.$refs.option[0].focus()
    },
    optionProp (option, prop = 'value') {
      switch (prop) {
        case 'value':
          return this.valueKey ? option[this.valueKey] : option
        case 'text':
          return this.textKey ? option[this.textKey] : option
        case 'disabled':
          return this.disabledKey ? option[this.disabledKey] : false
      }
    },
    selectOption (option) {
      if (!this.optionProp(option, 'disabled') && !this.disabled) {
        const optionValue = this.optionProp(option, 'value')
        let newValue
        if (this.multiple) {
          if (this.value && this.value.constructor === Array) {
            if (this.isChecked(option)) {
              newValue = this.value
              newValue.splice(newValue.indexOf(optionValue), 1)
            } else {
              newValue = this.value.concat(optionValue)
            }
          } else {
            newValue = [optionValue]
          }
        } else {
          if (this.isChecked(option)) {
            newValue = undefined
          } else {
            newValue = optionValue
          }
        }
        this.$emit('input', newValue)
      }
    },
    isChecked (option) {
      const optionValue = this.optionProp(option, 'value')
      const value = this.multipe ? (this.value && this.value.constructor === Array ? this.value : []) : (this.value)
      if (this.multiple) {
        if (this.value && this.value.constructor === Array) {
          return value.indexOf(optionValue) !== -1
        }
        return false
      } else {
        return value === optionValue
      }
    }
  },
  created () {
    if (typeof this.value !== 'undefined') {
      if (!(this.value instanceof Array) && this.multiple) {
        this.$emit('input', [this.value])
      }
    } else {
      this.$emit('input', this.multiple ? [] : undefined)
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-check {
  display: inline-block;
  height: 2em;
  margin: 0.9em 0;

  & .fv-check-item {
    border-radius: $border-radius;
    color: inherit;
    padding: ($padding-small / 2);

    &,
    & * {
      cursor: pointer;
    }

    &:not(:last-child) {
      margin-#{$block-end}: 0.7em;
    }

    &.disabled {
      @include disabled;
    }

    &.checked,
    &.checked * {
      color: $primary-color;
    }

    &:focus {
      @include outline;

      &:invalid,
      &[invalid] {
        @include outline($danger-color);
      }
    }
  }

  & .fv-check-icon {
    font-size: 18px;
    vertical-align: middle;
    width: 20px;
  }

  & .fv-control-label {
    display: inline;
    vertical-align: middle;
  }
}
</style>
