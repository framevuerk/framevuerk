<template lang="pug">
  .fv-inputbox.fv-input(ref="inputEl",
    :focus="isFocused || showOut",
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
        span.button(v-if="deleteButton", v-html="deleteIcon", fv-inputbox-cancel-enter, @click="onValueDelete(singleValue)")
      .item.transparent
        input.input(:value="searchQuery",
          v-if="input && !breaked",
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
      fv-main.out-container(v-if="showOut && !breaked", :class="{top: !outOnBottom, bottom: outOnBottom}", :style="{maxHeight: outMaxHeight}")
        fv-content
          slot(name="out")
    fv-dialog.not-center(ref="outDialog",
      v-if="breaked",
      :value="showOut",
      @input="showOut = $event",
      :style="dialogStyle")
      fv-header.fv-default
        fv-input.fv-block(v-if="input",
          autofocus,
          ref="dialogInput",
          :value="searchQuery",
          :placeholder="placeholder",
          @keydown.native="onInputKeydown",
          @input="onTyping")
        .fv-grow.fv-text-start(v-else,
          ref="dialogInput",
          autofocus,
          tabindex="0",
          @keydown="onInputKeydown")
          h4.fv-control-label {{placeholder}}
      fv-content
        slot(name="out")
</template>

<script>
import utility from '../utility'
import deleteIcon from '../icons/CLS.svg'

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
    }
  },
  inject: {
    fvMain: {},
    fvFormElement: {
      default: false
    }
  },
  data () {
    return {
      isFocused: false,
      showOut: false,
      outOnBottom: true,
      outMaxHeight: 'auto',
      breaked: false,
      deleteIcon
    }
  },
  computed: {
    showPlaceholder () {
      return this.searchQuery === '' && (typeof this.value === 'undefined' || (this.multiple && !this.value.length))
    },
    values () {
      return this.multiple ? this.value : (typeof this.value === 'undefined' ? [] : [this.value])
    },
    dialogStyle () {
      return {
        width: `calc(100% - 30px)`,
        maxHeight: `calc(100% - 60px)`,
        top: '15px',
        left: '15px',
        right: '15px'
      }
    }
  },
  methods: {
    focus () {
      this.$refs.input.focus()
    },
    calcBreaked () {
      this.breaked = this.fvMain.getSize().indexOf('md') === -1
    },
    focusInput () {
      if (this.breaked && this.showOut) {
        this.$refs.dialogInput.focus()
        this.isFocused = true
      } else {
        this.$refs.input.focus()
      }
    },
    onFocus () {
      this.isFocused = true
      if (this.fvFormElement) {
        this.fvFormElement.turn(true)
      }
    },
    onBlur () {
      const action = () => {
        this.isFocused = false
        this.$emit('blur')
        if (this.fvFormElement) {
          this.fvFormElement.turn(false)
        }
      }
      this.$nextTick(() => {
        const elem = document.querySelector(':focus')
        if (this.breaked) {
          if (!this.showOut && (!elem || !utility.isChildOf(elem, this.$el))) {
            action()
          }
        } else {
          if ((!elem || !utility.isChildOf(elem, this.$el))) {
            this.close()
            action()
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
      const parentEl = this.fvMain.$el
      const parentHeight = parentEl.offsetHeight
      const elHeight = this.$el.offsetHeight
      const top = utility.offsetTo(this.$el, parentEl).top
      this.outOnBottom = !(top > (parentHeight / 2))
      const bottom = parentHeight - top - elHeight
      const padding = 30
      this.outMaxHeight = `${(parentHeight - (this.outOnBottom ? top : bottom) - elHeight) - padding}px`
    },
    open () {
      if (!this.showOut) {
        this.$emit('open')
      }
      if (this.breaked) {
        this.showOut = true
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
      this.showOut = false
      this.$emit('searchQuery:update', '')
    },
    onInputKeydown (event) {
      if (this.showOut) {
        this.$emit('input-keydown', event)
      }
    }
  },
  created () {
    if (!this.fvMain) {
      throw utility.error('no_fvmain_parent')
    }
  },
  mounted () {
    window.addEventListener('resize', this.calcBreaked)
    this.$nextTick(() => {
      this.calcBreaked()
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.calcBreaked)
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
  width: 17em;
  max-width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  & > .caret-icon {
    #{$block-end}: 0;
    padding-#{$block-start}: $padding / 2;

    & > svg {
      height: 1.5em;
      vertical-align: middle;
    }
  }

  & > .value-container {
    width: 80%;
    max-width: 80%;

    & > .item {
      padding: 0 0.25em;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
      vertical-align: middle;

      & > span {
        vertical-align: middle;
      }

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
    position: absolute;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 75%;
  }
}
</style>
