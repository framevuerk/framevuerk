<template lang="pug">
.fv-check(:checked="isChecked",
  :multiple="multiple",
  :disabled="disabled",
  @click="onClick",
  @keydown.space.prevent="onClick",
  :invalid="!fvValidate",
  :tabindex="disabled ? '' : 0")
  .box(:class="{square: multiple, circle: !multiple}")
  span.label
    template(v-if="!label")
      slot
    template(v-else) {{label}}
</template>

<script>
export default {
  props: {
    value: {
      default: undefined
    },
    content: {
      default: undefined,
      required: true
    },
    label: {
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
      isValid: true,
      icons: {
        square: require('../icons/feather/square.svg'),
        circle: require('../icons/feather/circle.svg'),
        checkSquare: require('../icons/feather/check-square.svg'),
        checkCircle: require('../icons/feather/check-circle.svg')
      }
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
        return this.required(this.value)
      }
      return true
    },
    isChecked () {
      const content = JSON.stringify(this.content)
      if (this.multiple) {
        if (this.value.findIndex(v => JSON.stringify(v) === content) > -1) {
          return true
        }
      } else {
        return JSON.stringify(this.value) === content
      }
      return false
    }
  },
  methods: {
    focus () {
      if (!this.disabled) {
        this.$el.focus()
      }
    },
    setStructure () {
      if (this.multiple && (typeof this.value === 'undefined' || !(this.value instanceof Array))) {
        this.$emit('input', [])
      }
    },
    onClick () {
      if (this.disabled) {
        return
      }
      let value = typeof this.value === 'undefined' ? undefined : JSON.parse(JSON.stringify(this.value))
      if (this.multiple) {
        const content = JSON.stringify(this.content)
        if (this.isChecked) {
          value.splice(value.findIndex(v => JSON.stringify(v) === content), 1)
        } else {
          value.push(this.content)
        }
      } else {
        if (this.isChecked) {
          value = undefined
        } else {
          value = JSON.parse(JSON.stringify(this.content))
        }
      }
      this.$emit('input', value)
    }
  },
  created () {
    this.setStructure()
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-check {
  display: inline-block;
  margin: 0;
  margin-#{$block-end}: #{$padding};
  cursor: pointer;

  & > .box {
    @include shadow(bottom);

    height: 1.5em;
    width: 1.5em;
    background: contrast($bg-color, 1, force-light);
    border: solid 1px contrast($bg-color, 2, hard-dark);
    display: inline-block;
    position: relative;
    vertical-align: middle;
    margin-#{$block-end}: #{$padding / 2};

    &.square {
      border-radius: 2px;
    }

    &.circle {
      border-radius: 50%;
    }
  }

  & > .label {
    display: inline-block;
  }

  &[checked] {
    & > .box::before {
      @include shadow(bottom);

      content: '';
      height: 50%;
      width: 50%;
      border-radius: 100%;
      border: none;
      background: $primary-color;
      position: absolute;
      transform: translate(-50%, -50%);
      left: 50%;
      top: 50%;
    }

    &[multiple] > .box::before {
      background: transparent;
      height: 30%;
      width: 70%;
      border-radius: 0;
      border-bottom-left-radius: 0.1em;
      border: solid 0.2em $primary-color;
      border-top: none;
      border-right: none;
      position: absolute;
      transform: rotateZ(-45deg);
      left: 5%;
      top: 21%;
    }
  }

  &:not([disabled]) {
    &:hover {
      & > .box {
        border: solid 1px contrast($bg-color, 3, hard-dark);
      }
    }

    &:focus,
    &[focus] {
      & > .box {
        @include outline;
      }

      &:invalid,
      &[invalid] {
        & > .box {
          @include outline($danger-color);
        }
      }
    }
  }

  &[disabled] {
    @include disabled;
  }
}
</style>
