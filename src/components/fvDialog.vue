<template lang="pug">
transition(name="fv-fade")
  fv-main.fv-dialog(:class="left === null || top === null ? 'center' : ''",
    :parent="false",
    :style="{left: left === null ? false : left, top: top === null ? false : top, width: width, height: height}",
    v-if="visible",
    ref="dialog",
    @keydown.native="onKeydown($event); $emit('keydown', $event)",
    @click.native="$emit('click', $event)")
    .header(v-if="title.length > 0")
      .title
        label.fv-control-label(v-html="title")
    fv-content(v-if="content",
      v-html="content")
    slot(v-else, :param="param")
    .footer(v-if="buttons.length > 0")
      .fv-grow
      fv-button(v-for="(button, i) in buttons",
        :key="i",
        v-bind="button",
        @click="onButtonClick(button)")
</template>

<script>
import utility from '../utility'
import fvMain from './fvMain.vue'
import fvHeader from './fvHeader.vue'
import fvContent from './fvContent.vue'
import fvFooter from './fvFooter.vue'
import fvButton from './fvButton.vue'

export default {
  components: {
    fvMain,
    fvHeader,
    fvContent,
    fvFooter,
    fvButton
  },
  props: {
    title: {
      default: ''
    },
    content: {
      default: ''
    },
    left: {
      default: null
    },
    top: {
      default: null
    },
    width: {
      default: undefined
    },
    height: {
      default: undefined
    },
    modal: {
      type: Boolean,
      default: false
    },
    autoClose: {
      type: Boolean,
      default: true
    },
    buttons: {
      type: Array,
      default: () => []
    },
    firstFocusOn: {
      type: [Number, Boolean],
      default: false // can be index or false (lastindex) or true (firstindex)
    }
  },
  data () {
    return {
      visible: false,
      param: null,
      focusBackElem: null,
      focusableItems: [],
      hashChange: true // some hash changes applied by this component and does not need to be handeled. this variable keep state of this.
    }
  },
  computed: {
    hash () {
      return `${window.location.hash.indexOf('?') !== -1 ? '&' : '?'}fv${this._uid}`
    }
  },
  methods: {
    addHash () {
      window.location.hash += this.hash
    },
    removeHash () {
      window.location.hash = window.location.hash.replace(this.hash, '')
    },
    toggle () {
      this[this.visible ? 'close' : 'open']()
    },
    open (param = null) {
      this.addHash()
      const main = utility.fvParent(this, 'fv-main')
      main.lock()
      main.$on('overlay-click', this.closeIf)
      main.$el.appendChild(this.$el)
      this.visible = true
      this.param = param
      this.focusBackElem = document.querySelector(':focus')
      this.$emit('open', this.param)
      this.$nextTick(() => {
        const padding = parseInt(process.env.padding)
        const bottom = this.$refs.dialog.$el.offsetHeight + this.$refs.dialog.$el.offsetTop
        const right = this.$refs.dialog.$el.offsetLeft + this.$refs.dialog.$el.offsetWidth
        if (bottom > main.$el.offsetHeight - padding) {
          const newTop = this.$refs.dialog.$el.offsetTop - (bottom - main.$el.offsetHeight)
          this.$emit('update:top', `${newTop - padding}px`)
        }
        if (right > main.$el.offsetWidth - padding) {
          const newLeft = this.$refs.dialog.$el.offsetLeft - (right - main.$el.offsetWidth)
          this.$emit('update:left', `${newLeft - padding}px`)
        }
        setTimeout(() => {
          this.focus(this.firstFocusOn)
          window.addEventListener('hashchange', this.closeIf)
        })
      })
    },
    close () {
      window.removeEventListener('hashchange', this.closeIf)
      this.removeHash()
      const main = utility.fvParent(this, 'fv-main')
      main.unlock()
      main.$off('overlay-click', this.closeIf)
      this.visible = false
      if (this.focusBackElem) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.focusBackElem.focus()
          })
        })
      }
      this.$emit('close', this.param)
    },
    closeIf (event) {
      if (this.modal === false) {
        this.close()
      } else if (event.type === 'hashchange') {
        if (this.hashChange) {
          this.addHash()
        }
        this.hashChange = !this.hashChange
      }
    },
    focus (index = true) {
      this.focusableItems = this.$el.querySelectorAll('select, input, textarea, button, [tabindex]:not([tabindex=""])')
      let i
      if (typeof index === 'boolean') {
        i = index ? 0 : this.focusableItems.length - 1
      } else {
        i = index
      }
      this.focusableItems[i].focus()
    },
    onKeydown (event) {
      switch (event.which) {
        case 9: // tab
          if (event.target === this.focusableItems[0] && event.shiftKey) { // when first item is focused and user press shift + tab
            event.preventDefault()
            this.focus(false)
          } else if (event.target === this.focusableItems[this.focusableItems.length - 1] && !event.shiftKey) { // when last item is focused and user press tab
            event.preventDefault()
            this.focus(true)
          }
          break
        case 27: // esc
          this.closeIf(event)
      }
    },
    onButtonClick (button) {
      this.$emit('button-click', button, this.param)
      if (this.autoClose) {
        this.close()
      }
    }
  },
  beforeDestroy () {
    this.$el.remove()
  }
}

</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-dialog {
  @include yiq($bg-color);
  @include shadow(bottom);

  backface-visibility: hidden;
  height: auto;
  min-width: 200px;
  overflow: auto;
  position: absolute;
  border-radius: $border-radius;
  max-height: calc(100% - #{$padding * 2});
  max-width: calc(100% - #{$padding * 2});
  padding: 0;
  z-index: 2;

  & > .header,
  & > .footer {
    padding: $padding;
  }

  &.center {
    transform: translate3d(-50%, -50%, 0);
    left: 50%;
    top: 50%;
  }

  & > .footer {
    display: flex;

    & > .fv-button {
      margin-#{$block-start}: $padding;
    }
  }
}
</style>
