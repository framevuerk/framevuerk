<template lang="pug">
span
  transition(name="fv-fade")
    .fv-overlay(v-if="visible",
      @click="closeIf()")
  transition(name="fv-dialog")
    fv-main.fv-dialog(:class="left === null || top === null ? 'center' : ''",
      :style="{left: left === null ? false : left, top: top === null ? false : top, width: width, height: height}",
      v-if="visible",
      ref="dialog",
      @keydown.native="onKeydown($event); $emit('keydown', $event)",
      @click.native="$emit('click', $event)")
      fv-header(height="40px",
        v-if="title.length > 0")
        .title
          label.fv-control-label(v-html="title")
      fv-content(v-if="content",
        v-html="content")
      slot(v-else)
      fv-footer(v-if="buttons.length > 0")
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
      default: 'auto'
    },
    height: {
      default: 'height'
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
      isRendered: false,
      visible: false,
      param: null,
      focusBackElem: null,
      focusableItems: []
    }
  },
  methods: {
    toggle () {
      this[this.visible ? 'close' : 'open']()
    },
    open (param = null) {
      const main = utility.fvParent(this, 'fv-main')
      main.$el.appendChild(this.$el)
      this.visible = true
      this.param = param
      this.focusBackElem = document.querySelector(':focus')
      this.$emit('open', this.param)
      utility.doIt(() => {
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
        this.focus(this.firstFocusOn)
      })
    },
    close () {
      this.visible = false
      if (this.focusBackElem) {
        this.focusBackElem.focus()
      }
      this.$emit('close', this.param)
    },
    closeIf () {
      if (this.modal === false) {
        this.close()
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
          this.closeIf()
      }
    },
    onButtonClick (button) {
      this.$emit('button-click', button, this.param)
      if (this.autoClose) {
        this.close()
      }
    }
  },
  mounted () {
    utility.doIt(() => {
      this.isRendered = true
    })
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
  min-width: 280px;
  overflow: auto;
  position: absolute;
  border-radius: $border-radius;
  max-height: 90%;
  max-width: 90%;
  z-index: 2;

  &.center {
    transform: translate3d(-50%, -50%, 0);
    left: 50%;
    top: 50%;
  }

  @include vue-animation(fv-dialog, enter) {
    opacity: 1;
    transition-duration: $transition-speed;
    transition-property: transform, opacity;
    transition-timing-function: ease;
    transition-delay: 0.1s;
    will-change: transform, opacity;
  }

  @include vue-animation(fv-dialog, leave) {
    opacity: 0;

    &:not(.center) {
      transform: translate3d(0, -10%, 0);
    }

    &.center {
      transform: translate3d(-50%, -60%, 0);
    }
  }
}
</style>
