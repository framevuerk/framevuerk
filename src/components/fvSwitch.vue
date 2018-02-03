<template lang="pug">
span.fv-switch(:class="{ on: onValue === pValue }",
  :disabled="disabled",
  :invalid="!fvValidate",
  @click="toggle",
  :tabindex="disabled? '': 0",
  @keydown="onKeydown")
  span.fv-handler
</template>

<script>
export default {
  props: {
    value: {
      default: false
    },
    onValue: {
      default: true
    },
    offValue: {
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
      hammer: undefined,
      pValue: this.value,
      dirs: {
        off: process.env.direction === 'ltr' ? 'left' : 'right',
        on: process.env.direction === 'ltr' ? 'right' : 'left'
      }
    }
  },
  computed: {
    fvValidate () {
      if (this.required === true) {
        return this.value === this.onValue
      } else if (typeof this.required === 'function') {
        return this.required()
      }
      return true
    }
  },
  watch: {
    value (v) {
      this.pValue = v
      this.setStructure()
    }
  },
  created () {
    this.setStructure()
    this.hammer = require('../').dependencies.hammer
  },
  mounted () {
    this.initHammer()
  },
  methods: {
    toggle () {
      if (!this.disabled) {
        this.pValue = this.pValue === this.onValue ? this.offValue : this.onValue
        this.$emit('input', this.pValue)
      }
    },
    on () {
      if (!this.disabled) {
        this.pValue = this.onValue
        this.$emit('input', this.pValue)
      }
    },
    off () {
      if (!this.disabled) {
        this.pValue = this.offValue
        this.$emit('input', this.pValue)
      }
    },
    setStructure () {
      if ([this.offValue, this.onValue].indexOf(this.value) === -1) {
        this.off()
      }
    },
    onKeydown (event) {
      switch (event.which) {
        case 13: case 32: // enter, space
          event.preventDefault()
          this.toggle()
          break
      }
    },
    initHammer () {
      if (this.hammer) {
        const mc = new this.hammer.Manager(this.$el, {
          recognizers: [
            [this.hammer.Swipe, { direction: this.hammer.DIRECTION_HORIZONTAL }]
          ]
        })
        mc.on(`swipe${this.dirs.on}`, this.on)
        mc.on(`swipe${this.dirs.off}`, this.off)
      }
    }
  }
}

</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-switch {
  background: $bg-color-dark;
  border: solid 1px $shadow-color;
  border-radius: 25px;
  cursor: pointer;
  direction: $direction;
  display: inline-block;
  height: 2em;
  margin: 0.9em 0;
  padding: 0.1em;
  vertical-align: middle;
  width: 3.8em;

  & > .fv-handler {
    background: $bg-color-light;
    border: solid 1px $shadow-color;
    border-radius: 25px;
    box-shadow: 0 1px 4px $shadow-color;
    display: inline-block;
    height: 100%;
    width: calc(1.8em - 2px);
    transition-duration: $transition-speed-fast;
    transition-property: margin;
    transition-timing-function: ease;
    will-change: margin;
  }

  &.on {
    background: $primary-color-light;

    & > .fv-handler {
      border: solid 1px $shadow-color-light;
      margin-#{$block-start}: 1.8em;
    }
  }

  &:focus {
    @include outline;

    &:invalid,
    &[invalid] {
      @include outline($danger-color);
    }
  }

  &[disabled] {
    @include disabled;
  }
}
</style>
