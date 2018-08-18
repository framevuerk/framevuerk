<template lang="pug">
transition(:name="animation")
  fv-main.fv-dialog(:parent="false",
    v-show="visible",
    @keydown.native="onKeydown($event)")
    slot
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
    overlay: {
      type: Boolean,
      default: true
    },
    animation: {
      type: String,
      default: 'fv-fade'
    },
    visible: {
      type: Boolean
    }
  },
  data () {
    return {
      focusBackElement: null,
      focusableItems: [],
      overlayElement: null,
      main: undefined
    }
  },
  computed: {
    hash () {
      return `fv-dialog-${this._uid}`
    }
  },
  methods: {
    getMain () {
      if (!this.main) {
        this.main = utility.fvParent(this, 'fv-main')
      }
      return this.main
    },
    addHash (addEvent = true) {
      if (window.location.hash.indexOf(this.hash) === -1) {
        const seperator = window.location.hash.indexOf('?') !== -1 ? '&' : '?'
        window.location.hash += seperator + this.hash
      }
      if (addEvent) {
        setTimeout(() => {
          window.addEventListener('hashchange', this.onHashChange)
        })
      }
    },
    removeHash () {
      window.location.hash = window.location.hash.replace(this.hash, '')
      window.removeEventListener('hashchange', this.onHashChange)
    },
    onHashChange () {
      if (window.location.hash.indexOf(this.hash) === -1) {
        this.close()
      }
    },
    addOverlay () {
      this.overlayElement = document.createElement('div')
      this.overlayElement.classList.add('fv-overlay')
      this.overlayElement.addEventListener('click', this.close)
      const main = this.getMain()
      main.$el.insertBefore(this.overlayElement, this.$el)
    },
    removeOverlay () {
      if (this.overlayElement) {
        this.overlayElement.removeEventListener('click', this.close)
        this.overlayElement.remove()
      }
    },
    close () {
      this.$emit('update:visible', false)
    },
    onOpen () {
      this.$emit('open')
      this.$nextTick(() => {
        const main = this.getMain()
        main.$el.appendChild(this.$el)
        if (this.overlay) {
          this.addOverlay()
          this.focus()
          this.addHash()
        }
      })
    },
    visibleHandler (value) {
      if (value) {
        return this.onOpen()
      }
      return this.onClose()
    },
    onCancel () {
      if (this.visible && this.overlay) {
        this.close()
      }
    },
    onClose () {
      this.$emit('close')
      this.$nextTick(() => {
        if (this.overlay && !this.visible) {
          this.removeOverlay()
          this.focusBack()
          this.removeHash()
        }
      })
    },
    focus () {
      this.focusBackElement = document.querySelector(':focus')
      this.focusableItems = this.$el.querySelectorAll('select, input, textarea, button, [tabindex]:not([tabindex=""])')
      const autoFocus = this.$el.querySelector('[autofocus]')
      if (autoFocus) {
        autoFocus.focus()
      } else if (this.focusableItems.length) {
        this.focusableItems[this.focusableItems.length - 1].focus()
      }
    },
    focusBack () {
      if (this.focusBackElement) {
        this.focusBackElement.focus()
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
    }
  },
  watch: {
    visible (value) {
      this.visibleHandler(value)
    }
  },
  beforeDestroy () {
    this.onClose()
    this.$el.remove()
  }
}

</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-dialog {
  @include shadow(bottom, $shadow-color);

  backface-visibility: hidden;
  height: auto;
  min-width: 200px;
  overflow: auto;
  position: absolute;
  border-radius: $border-radius;
  max-height: 100%;
  max-width: 100%;
  padding: 0;
  z-index: 2;

  & > .header,
  & > .footer {
    padding: $padding;
  }

  &:not(.not-center) {
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
