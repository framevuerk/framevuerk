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
      pValue: this.value
    }
  },
  computed: {
    fvValidate () {
      if (this.required === true) {
        return this.value === this.onValue
      } else if (typeof this.required === 'function') {
        return this.required(this.value)
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
    }
  }
}

</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-switch {
  @include shadow(bottom);

  background: contrast($bg-color, 1, force-dark);
  border: solid 1px contrast($bg-color, 2, hard-dark);
  border-radius: 25px;
  cursor: pointer;
  direction: $direction;
  display: inline-block;
  height: 2.2em;
  padding: 0.2em;
  vertical-align: middle;
  width: 3.8em;
  text-align: $block-start;

  & > .fv-handler {
    @include shadow(bottom);

    background: contrast($bg-color, 2, force-light);
    border: solid 1px contrast($bg-color, 2);
    border-radius: 25px;
    display: inline-block;
    height: 100%;
    width: calc(1.8em - 2px);
    transition-duration: $transition-speed-fast;
    transition-property: margin;
    transition-timing-function: ease;
    will-change: margin;
  }

  &.on {
    background: contrast($primary-color, 2, hard-light);

    & > .fv-handler {
      margin-#{$block-start}: 1.7em;
    }
  }

  &:focus {
    @include outline;

    &:invalid,
    &[invalid] {
      @include outline($danger-color);
    }
  }

  &:active > .fv-handler {
    @include shadow(inset-bottom);
  }

  &:hover:not(:focus):not([disabled]) {
    border: solid 1px contrast($bg-color, 3, hard-dark);
  }

  &[disabled] {
    @include disabled;
  }
}
</style>
