<template lang="pug">
  .fv-inputbox.fv-input(ref="inputEl",
    :focus="isFocused || showOut",
    :disabled="disabled",
    @click="onEnter",
    @keydown.enter="onEnter",
    @keydown.esc="onOutClose")
    .placeholder(v-if="showPlaceholder", v-text="placeholder")
    .value-container
      .item(v-for="singleValue in values")
        slot(v-if="$scopedSlots.value",
          name="value",
          :value="singleValue")
        span(v-else) {{singleValue}}
        .button(v-if="deleteButton", v-html="require('../icons/feather/x.svg')", fv-inputbox-cancel-enter, @click="onValueDelete(singleValue)")
      .item.transparent
        input.input(:value="searchQuery",
          v-if="input && !isBreaked",
          @focus="onFocus",
          @blur="onBlur",
          :disabled="disabled"
          @keydown="onInputKeydown",
          @input="onTyping",
          :size="searchQuery.length || 1",
          ref="input")
        .input(v-else,
          tabindex="0",
          @focus="onFocus",
          @blur="onBlur",
          @keydown="onInputKeydown",
          ref="input")
    .caret-icon(v-if="caretIcon",
      v-html="caretIcon")
    transition(name="fv-fade")
      fv-main.out-container(v-if="showOut && !isBreaked", :class="{top: !outOnBottom, bottom: outOnBottom}", :style="{maxHeight: outMaxHeight}")
        fv-content.fv-no-padding
          slot(name="out")
    fv-dialog(ref="outDialog", v-if="isBreaked", :first-focus-on="0", :top="padding", :left="padding", width="100%", @close="onOutClose")
      fv-header.fv-default
        fv-input.fv-block(v-if="input",
          ref="dialogInput",
          :value="searchQuery",
          :placeholder="placeholder",
          @keydown.native="onInputKeydown",
          @input="onTyping")
        .title(v-else,
          ref="dialogInput",
          tabindex="0",
          @keydown="onInputKeydown")
          h4.fv-control-label {{placeholder}}
      fv-content.fv-no-padding
        slot(name="out")
</template>

<script>
import utility from '../utility'
import locale from 'locale'

export default {
  props: {
    value: {
      default: undefined
    },
    multiple: {
      type: Boolean,
      default: false
    },
    deleteButton: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    caretIcon: {
      default: ''
    },
    searchQuery: {
      default: ''
    },
    input: {
      type: Boolean,
      default: true
    },
    breaked: {
      type: [Boolean, Object],
      validator: (value) => {
        return [true, false, null].indexOf(value) > -1
      },
      default: null
    }
  },
  data () {
    return {
      isFocused: false,
      showOut: false,
      outOnBottom: true,
      outMaxHeight: 'auto',
      locale,
      padding: process.env.padding
    }
  },
  computed: {
    showPlaceholder () {
      return this.searchQuery === '' && (typeof this.value === 'undefined' || (this.multiple && !this.value.length))
    },
    values () {
      return this.multiple ? this.value : (typeof this.value === 'undefined' ? [] : [this.value])
    },
    isBreaked () {
      if (this.breaked === null) {
        const main = utility.fvParent(this, 'fv-main')
        return utility.viewportSize(main.$el).indexOf('md') === -1
      }
      return this.breaked
    }
  },
  methods: {
    focus () {
      this.$refs.input.focus()
    },
    focusInput () {
      if (this.isBreaked && this.showOut) {
        this.$refs.dialogInput.focus()
        this.isFocused = true
      } else {
        this.$refs.input.focus()
      }
    },
    onFocus () {
      this.isFocused = true
    },
    onBlur () {
      this.$nextTick(() => {
        const elem = document.querySelector(':focus')
        if (this.isBreaked) {
          if (!this.showOut && (!elem || !utility.isChildOf(elem, this.$el))) {
            this.isFocused = false
            this.$emit('blur')
          }
        } else {
          if ((!elem || !utility.isChildOf(elem, this.$el))) {
            this.isFocused = false
            this.close()
            this.$emit('blur')
          }
        }
      })
    },
    onTyping (event) {
      const searchQuery = typeof event === 'object' ? event.target.value : event
      this.showOut = true
      this.$emit('update:searchQuery', searchQuery)
      this.$emit('typing', searchQuery)
    },
    onEnter (event) {
      if (this.disabled) {
        return
      }
      let target = event.target
      while (target && target !== this.$el) {
        if (target.getAttribute('fv-inputbox-cancel-enter')) {
          return
        }
        target = target.parentElement || null
      }
      this.focus()
      this.open()
    },
    calcOutPosition () {
      const parentHeight = utility.fvParent(this, 'fv-main').$el.offsetHeight
      const elHeight = this.$el.offsetHeight
      const top = utility.offsetTo(this.$el, utility.fvParent(this, 'fv-main').$el).top
      this.outOnBottom = !(top > (parentHeight / 2))
      const bottom = parentHeight - top - elHeight
      const padding = parseInt(process.env.padding)
      this.outMaxHeight = `${(parentHeight - (this.outOnBottom ? top : bottom) - elHeight) - (padding * 2)}px`
    },
    open () {
      if (!this.showOut) {
        this.$emit('open')
      }
      if (this.isBreaked) {
        this.showOut = true
        this.$refs.outDialog.open()
        this.focus()
      } else {
        this.calcOutPosition()
        this.showOut = true
        this.focus()
      }
    },
    onValueDelete (value) {
      this.$emit('value-delete', value)
    },
    close () {
      this.$emit('close')
      if (this.isBreaked) {
        this.$refs.outDialog.close()
      }
      this.showOut = false
      this.$emit('searchQuery:update', '')
    },
    onOutClose () {
      this.showOut = false
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
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  & > .caret-icon {
    #{$block-end}: 0;
    padding-#{$block-start}: $padding;
    height: 100%;

    & > svg {
      height: 100%;
      vertical-align: middle;
    }
  }

  & > .value-container {
    width: 100%;

    & > .item {
      @include shadow(bottom);

      float: $block-start;
      margin: $padding / 3;
      margin-#{$block-start}: 0;
      border: solid 1px contrast($bg-color, 2);
      padding: 0 $padding-small;
      border-radius: $border-radius;

      &.transparent {
        background: transparent;
        padding: 0;
        border: 0;
        box-shadow: none;

        & .input {
          display: inline-block;
          border: none;
          background: transparent;
          width: auto;
        }
      }

      & .button {
        margin-#{$block-start}: $padding;
        cursor: pointer;
        color: $color;
        height: 1.2em;
        float: $block-end;

        & > svg {
          height: 100%;
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
    @include shadow(bottom);

    position: absolute;
    #{$block-start}: 0;
    overflow: auto;
    width: 100%;
    border: solid 1px contrast($bg-color, 2);
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
  }

  & > .placeholder {
    color: contrast($bg-color, 3);
    position: absolute;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 75%;
  }
}
</style>
