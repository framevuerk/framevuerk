<template lang="pug">
transition(:name="animation")
  fv-main.fv-dialog(:class="left === null && top === null && right === null && bottom === null ? 'center' : ''",
    :parent="false",
    :style="{left: left === null ? false : left, right: right === null ? false : right, top: top === null ? false : top, bottom: bottom === null ? false : bottom, width: width, height: height}",
    v-if="visible",
    key="dialog",
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
    right: {
      default: null
    },
    top: {
      default: null
    },
    bottom: {
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
    overlay: {
      type: Boolean,
      default: true
    },
    animation: {
      type: String,
      default: 'fv-fade'
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
      overlayId: null,
      main: undefined
    }
  },
  computed: {
    showOverlay () {
      return this.modal || this.overlay
    }
  },
  methods: {
    getMain () {
      if (!this.main) {
        this.main = utility.fvParent(this, 'fv-main')
      }
      return this.main
    },
    fixPosition () {
      const main = this.getMain()
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
    },
    toggle () {
      this[this.visible ? 'close' : 'open']()
    },
    open (param = null) {
      if (this.visible) {
        return
      }
      this.param = param
      this.visible = true
      this.$emit('open', this.param)
      const main = this.getMain()
      this.focusBackElem = document.querySelector(':focus')
      this.$nextTick(() => {
        if (this.showOverlay) {
          this.overlayId = main.$lock(this.forceClose, this.modal)
          setTimeout(() => {
            this.focus(this.firstFocusOn)
          })
        }
        main.$appendChild(this.$refs.dialog.$el)
        this.fixPosition()
      })
    },
    onCancel () {
      if (this.visible && !this.modal) {
        this.forceClose()
      }
    },
    forceClose () {
      this.visible = false
      this.$emit('close', this.param)
      if (this.focusBackElem && this.overlay) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.focusBackElem.focus()
          })
        })
      }
    },
    close () {
      if (!this.visible) {
        return
      }
      if (this.showOverlay) {
        const main = this.getMain()
        main.$unlock(this.overlayId)
      } else {
        this.forceClose()
      }
    },
    focus (index = true) {
      this.focusableItems = this.$refs.dialog.$el.querySelectorAll('select, input, textarea, button, [tabindex]:not([tabindex=""])')
      let i
      if (typeof index === 'boolean') {
        i = index ? 0 : this.focusableItems.length - 1
      } else {
        i = index
      }
      if (this.focusableItems.length) {
        this.focusableItems[i].focus()
      }
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
          this.onCancel()
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
    if (this.overlayId) {
      const main = this.getMain()
      main.$unlock(this.overlayId)
    }
    this.$el.remove()
  }
}

</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-dialog {
  // @include yiq($bg-color);
  @include shadow(bottom);

  backface-visibility: hidden;
  height: auto;
  min-width: 200px;
  overflow: auto;
  position: absolute;
  border-radius: $border-radius;
  // max-height: calc(100% - #{$padding * 2});
  // max-width: calc(100% - #{$padding * 2});
  max-height: 100%;
  max-width: 100%;
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
