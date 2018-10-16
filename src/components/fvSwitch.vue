<template lang="pug">
span.fv-switch(:class="{ on: onValue === pValue }",
  :disabled="disabled",
  :invalid="!fvValidate",
  @click="toggle",
  :tabindex="disabled? '': 0",
  @keydown.space.prevent="toggle")
  .container
    span.handler
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
        if (this.pValue === this.onValue) {
          this.off()
        } else {
          this.on()
        }
      }
    },
    on () {
      this.pValue = this.onValue
      this.$emit('input', this.pValue)
    },
    off () {
      this.pValue = this.offValue
      this.$emit('input', this.pValue)
    },
    setStructure () {
      if ([this.offValue, this.onValue].indexOf(this.value) === -1 && !this.disabled) {
        this.off()
      }
    }
  }
}

</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-switch {
  display: inline-block;
  min-height: heightSize(md);
  width: 3.8em;
  position: relative;

  & .container {
    @include shadow(bottom);

    background: contrast($bg-color, 1, force-dark);
    border: solid 1px contrast($bg-color, 2, hard-dark);
    border-radius: $border-radius;
    cursor: pointer;
    direction: $direction;
    padding: 0.2em;
    height: 100%;
    width: 100%;
    position: absolute;
    text-align: $block-start;
  }

  & .handler {
    @include shadow(bottom);

    background: contrast($bg-color, 2, force-light);
    border: solid 1px contrast($bg-color, 2);
    border-radius: $border-radius;
    display: inline-block;
    height: 100%;
    width: calc(1.8em - 2px);
    transition-duration: $transition-speed-fast;
    transition-property: margin;
    transition-timing-function: ease;
    will-change: margin;
  }

  &.on {
    & .container {
      background: contrast($primary-color, 2, hard-light);
    }

    & .handler {
      margin-#{$block-start}: 1.6em;
    }
  }

  &:focus .container{
    @include outline;

    &:invalid,
    &[invalid] {
      @include outline($danger-color);
    }
  }

  &:active .handler {
    @include shadow(inset-bottom);
  }

  &:hover:not(:focus):not([disabled]) .container{
    border: solid 1px contrast($bg-color, 3, hard-dark);
  }

  &[disabled] .container{
    @include disabled;
  }
}
</style>
