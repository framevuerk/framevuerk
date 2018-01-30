<template lang="pug">
.fv-input.fv-input-select(v-if="renderType === 'display'",
  ref="inputEl",
  :class="{invalid: !fvValidate}",
  :tabindex="disabled? '': 0",
  :disabled="disabled",
  @keydown.enter="onEnter",
  @click="onEnter")
  span.placeholder(v-if="typeof displayValue == 'undefined' || displayValue === null || displayValue.length === 0",
    v-html="placeholder")
  .fv-input-select-item(v-else-if="displayValue.constructor == Array")
    span(v-for="val in displayValue",
    v-html="val")
  .fv-input-select-item(v-else)
    span(v-html="displayValue")
  span.fv-caret-icon
    i(v-if="caretIcon",
      :class="caretIcon")
input.fv-input(v-else,
  ref="inputEl",
  :disabled="disabled",
  :class="{invalid: !fvValidate}",
  :value="value",
  :placeholder="placeholder",
  @input="$emit('input', $event.target.value)")
</template>

<script>
export default {
  props: {
    value: {
      default: undefined
    },
    displayValue: {
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
    placeholder: {
      type: String,
      default: ''
    },
    renderType: {
      type: String,
      validator: (v) => {
        return ['normal', 'display']
      },
      default: 'normal'
    },
    caretIcon: {
      default: ''
    }
  },
  computed: {
    fvValidate () {
      if (this.required === true) {
        if (!this.value || (this.value.constructor === Array && this.value.length === 0)) {
          return false
        } else {
          return true
        }
      } else if (typeof this.required === 'function') {
        return this.required()
      }
      return true
    }
  },
  methods: {
    onEnter (event) {
      if (!this.disabled) {
        this.$emit('enter', event)
      }
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';

.fv-input {
  @include yiq($bg-color-light);
  @include shadow(bottom);
  @include sizes;

  align-items: center;
  border: 1px solid darken($bg-color-light, $shadow-percent);
  border-radius: $border-radius;
  display: flex;
  flex-direction: row;
  font-family: inherit;
  justify-content: space-between;
  padding: 0 $padding-small;

  &.search-style,
  &.fv-search-style {
    border-left: 0;
    border-radius: 0;
    border-right: 0;
    border-top: 0;
    box-shadow: none;

    &:focus,
    &.focus {
      @include bottom-outline;

      &:invalid,
      &.invalid {
        @include bottom-outline($danger-color);
      }
    }
  }

  &:focus,
  &.focus {
    @include outline;

    &:invalid,
    &.invalid {
      @include outline($danger-color);
    }
  }

  &[disabled],
  &.disabled {
    @include disabled;
  }

  &::placeholder,
  & > .placeholder {
    color: $gray-color-dark;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 75%;
  }

  &.fv-input-select,
  &.fv-input-datepicker {
    cursor: pointer;

    & > .fv-input-select-item {
      @include nowrap;

      & > span {
        &:not(:last-child)::after {
          color: $gray-color-dark;
          content: ',';
          display: inline-block;
          padding-#{$block-end}: 0.3em;
          padding-#{$block-start}: 0.1em;
        }
      }
    }

    & > .fv-input-select-item-single {
      padding: 0 0.5em;
    }

    & > .fv-caret-icon {
      float: $block-end;
      margin-left: 0.4em;
      margin-right: 0.4em;
    }
  }
}
</style>
