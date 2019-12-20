<template lang="pug">
span.fv-switch(:class="{ on: onValue === pValue }",
  :disabled="disabled",
  :invalid="!fvValidate",
  @click="toggle",
  :tabindex="disabled? '': 0",
  @focus="onFocus",
  @blur="onBlur",
  @keydown.space.prevent="toggle")
  .container
    span.handler
</template>

<script>
export default {
  props: {
    value: {
      default: false,
    },
    onValue: {
      default: true,
    },
    offValue: {
      default: false,
    },
    required: {
      type: [Boolean, Function],
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      pValue: this.value,
    };
  },
  inject: {
    fvFormElement: {
      default: false,
    },
  },
  computed: {
    fvValidate() {
      if (this.required === true) {
        return this.value === this.onValue;
      } if (typeof this.required === 'function') {
        return this.required(this.value);
      }
      return true;
    },
  },
  watch: {
    value(v) {
      this.pValue = v;
      this.setStructure();
    },
  },
  created() {
    this.setStructure();
  },
  methods: {
    toggle() {
      if (!this.disabled) {
        if (this.pValue === this.onValue) {
          this.off();
        } else {
          this.on();
        }
      }
    },
    on() {
      this.pValue = this.onValue;
      this.$emit('input', this.pValue);
    },
    off() {
      this.pValue = this.offValue;
      this.$emit('input', this.pValue);
    },
    focus() {
      if (!this.disabled) {
        this.$el.focus();
      }
    },
    onFocus() {
      if (this.fvFormElement) {
        this.fvFormElement.turn(true);
      }
    },
    onBlur() {
      if (this.fvFormElement) {
        this.fvFormElement.turn(false);
      }
    },
    setStructure() {
      if ([this.offValue, this.onValue].indexOf(this.value) === -1 && !this.disabled) {
        this.off();
      }
    },
  },
};

</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-switch {
  display: inline-block;
  min-height: heightSize(md);
  width: 4.2em;
  position: relative;
  vertical-align: middle;

  & .container {
    @include shadow(bottom);

    background: contrast($bg-color, 1, force-dark);
    border: solid 1px contrast($bg-color, 2, hard-dark);
    cursor: pointer;
    direction: $direction;
    padding: 0.2em;
    top: 0.2em;
    height: 2.2em;
    width: 4.2em;
    border-radius: 2em;
    position: absolute;
    text-align: $block-start;
    display: flex;
    align-items: center;
  }

  & .handler {
    @include shadow(bottom);

    background: contrast($bg-color, 2, force-light);
    border: solid 1px contrast($bg-color, 2);
    border-radius: 2em;
    display: block;
    height: 1.8em;
    width: 1.8em;
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
      margin-#{$block-start}: 1.9em;
    }
  }

  &[disabled] .container {
    @include disabled;
  }

  &:focus .handler {
    @include outline;
  }

  &:focus:invalid .handler,
  &:focus[invalid] .handler {
    @include outline($danger-color);
  }

  &:hover:not(:focus):not([disabled]) .handler {
    border: solid 1px contrast($bg-color, 3, hard-dark);
  }
}
</style>
