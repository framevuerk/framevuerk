<template lang="pug">
  .fv-inputbox.fv-input(ref="inputEl",
    :focus="isFocused || showOut",
    :opened="showOut",
    :disabled="disabled",
    @click="onEnter",
    @keydown.enter="onEnter",
    @keydown.esc="showOut = false")
    .placeholder(v-if="showPlaceholder", v-text="placeholder")
    .value-container
      .item(v-for="singleValue in values")
        span(v-if="$scopedSlots.value || $slots.value")
          slot(name="value", :value="singleValue")
        span(v-else) {{singleValue}}
        span.button(v-if="deleteButton", v-html="deleteIcon", fv-inputbox-cancel-enter, @click.stop="onValueDelete(singleValue)")
      .item.transparent
        input.input(:value="searchQuery",
          v-if="input",
          @focus="onFocus",
          @blur="onBlur",
          :disabled="disabled"
          @keydown="onInputKeydown",
          @input="onTyping",
          :size="searchQuery.length + 1 || 1",
          :type="inputType",
          ref="input")
        .input(v-else,
          tabindex="0",
          @focus="onFocus",
          @blur="onBlur",
          @keydown="onInputKeydown",
          ref="input")
    .caret-icon(v-if="caretIcon",
      v-html="caretIcon")
    transition(name="fv-inputbox")
      .out-container(v-show="showOut", :class="outClass")
        slot(name="out")
</template>

<script>
import parent from '../utility/parent.js'
import deleteIcon from '../icons/CLS.svg'

export default {
  props: {
    value: {
      default: undefined
    },
    multiple: {
      default: false
    },
    deleteButton: {
      default: true
    },
    disabled: {
      default: false
    },
    placeholder: {
      default: ''
    },
    caretIcon: {
      default: ''
    },
    searchQuery: {
      default: ''
    },
    input: {
      default: true
    },
    inputType: {
      default: 'text'
    }
  },
  inject: {
    fvFormElement: {
      default: false
    }
  },
  data () {
    return {
      isFocused: false,
      showOut: false,
      outClass: {},
      deleteIcon
    }
  },
  computed: {
    showPlaceholder () {
      return this.searchQuery === '' && (typeof this.value === 'undefined' || (this.multiple && !this.value.length))
    },
    values () {
      return this.multiple ? this.value : (typeof this.value === 'undefined' ? [] : [this.value])
    }
  },
  methods: {
    focus () {
      this.$refs.input.focus()
    },
    focusInput () {
      this.$refs.input.focus()
    },
    onFocus () {
      this.isFocused = true
      if (this.fvFormElement) {
        this.fvFormElement.turn(true)
      }
    },
    onBlur () {
      this.isFocused = false
      this.$emit('blur')
      if (this.fvFormElement) {
        this.fvFormElement.turn(false)
      }
    },
    onTyping (event) {
      this.showOut = true
      this.$emit('update:searchQuery', event.target.value)
      this.$emit('typing', event.target.value)
    },
    onEnter (event) {
      if (this.disabled) {
        return
      }
      this.focus()
      this.open()
    },
    getOutPosition () {
      const offset = this.$el.getBoundingClientRect()
      const parentViewport = parent.getViewport()
      // it will be one of [0, 1, 2]. lowest number is nearest to top
      const verticalPosition = offset.top / parentViewport.height
      // a number between 0 and 1. lowest number is nearest to start direction of block
      let horizontalPosition = offset[process.env.blockStart] / parentViewport.width
      if (process.env.direction === 'rtl') {
        horizontalPosition = 1 - horizontalPosition
      }
      const isBottom = verticalPosition < 0.5
      const isStart = horizontalPosition < 0.45
      return [
        isBottom ? 'bottom' : 'top',
        isStart ? 'start' : 'end'
      ]
    },
    open () {
      if (!this.showOut) {
        this.$emit('open')
      }
      this.outClass = this.getOutPosition()
      this.showOut = true
      this.focus()
      parent.on('outsideclick', this.$el, this.close)
    },
    onValueDelete (value) {
      this.$emit('value-delete', value)
    },
    close () {
      this.$emit('close')
      this.showOut = false
      parent.off('outsideclick', this.$el, this.close)
      this.$emit('searchQuery:update', '')
    },
    onInputKeydown (event) {
      if (this.showOut) {
        this.$emit('input-keydown', event)
      }
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';

.fv-inputbox {
  cursor: pointer;
  display: inline-flex;
  min-width: 17em;
  max-width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  user-select: none;

  & > .caret-icon {
    #{$block-end}: 0;
    padding-#{$block-start}: $padding / 2;

    & > svg {
      height: 1.5em;
      vertical-align: middle;
      transition: transform $transition-speed;
    }
  }

  &[opened] > .caret-icon {
    & > svg {
      transform: rotateX(180deg);
    }
  }

  & > .value-container {
    width: 80%;
    max-width: 80%;

    & > .item {
      @include shadow(bottom);

      padding: 0 #{$padding / 2};
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
      background: contrast($bg-color, 1, hard-dark);
      vertical-align: middle;
      outline-style: solid;
      outline-width: 1px;
      outline-color: contrast($bg-color, 2, hard-dark);
      outline-offset: 0;
      margin: $padding / 2;
      margin-#{$block-start}: 0;
      margin-#{$block-end}: $padding;
      border-radius: $border-radius;

      & > span {
        vertical-align: middle;
      }

      &.transparent {
        background: transparent;
        padding: 0;
        border: 0;
        box-shadow: none;
        outline: none;

        & .input {
          display: inline-block;
          border: none;
          background: transparent;
          width: auto;
          font-size: 1em;
          color: inherit;
        }
      }

      & .button {
        margin-#{$block-start}: $padding / 2;
        cursor: pointer;
        color: $color;
        height: 1.2em;

        & > svg {
          height: 1em;
          vertical-align: middle;
        }

        &:hover {
          color: contrast($color, 2);
        }

        &:active {
          color: contrast($color, 3);
        }
      }
    }
  }

  & > .out-container {
    @include yiq($bg-color);
    @include outline($shadow-color);

    position: absolute;
    overflow: auto;
    height: auto;
    width: 100%;
    border: solid 1px contrast($bg-color, 2, hard-dark);
    margin: $padding 0;
    cursor: default;
    border-radius: $border-radius;
    z-index: 2;

    &.bottom {
      top: 100%;
    }

    &.top {
      bottom: 100%;
    }

    &.end {
      #{$block-start}: auto;
      #{$block-end}: 0;
    }

    &.start {
      #{$block-end}: auto;
      #{$block-start}: 0;
    }

    &.fv-inputbox-enter-active,
    &.fv-inputbox-leave-active {
      transform: translate3d(0, 0, 0);
      transition-property: transform, opacity;
      transition-timing-function: ease;
      transition-duration: $transition-speed-fast;
      will-change: transform, opacity;
      backface-visibility: hidden;
    }

    &.fv-inputbox-enter,
    &.fv-inputbox-leave-active {
      opacity: 0;

      &.top {
        transform: translate3d(0, 1em, 0);
      }

      &.bottom {
        transform: translate3d(0, -1em, 0);
      }
    }
  }

  & > .placeholder {
    position: absolute;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 75%;
  }
}
</style>
