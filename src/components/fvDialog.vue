<template lang="pug">
transition(:name="animation")
  fv-main.fv-dialog(:parent="false",
    v-show="value",
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
    value: {
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
    }
  },
  data () {
    return {
      focusBackElement: null,
      focusableItems: [],
      overlayElement: null
    }
  },
  computed: {
    hash () {
      return `fv-${this._uid}`
    }
  },
  methods: {
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
      let hash = window.location.hash
      hash = hash.replace(this.hash, '')
      if (hash.lastIndexOf('&') === hash.length - 1 || hash.lastIndexOf('?') === hash.length - 1) {
        hash = hash.slice(0, hash.length - 1)
      }
      window.location.hash = hash
      window.removeEventListener('hashchange', this.onHashChange)
    },
    onHashChange () {
      if (window.location.hash.indexOf(this.hash) === -1) {
        this.close()
      }
    },
    addOverlay () {
      this.overlayElement = utility.requestParent(this, 'appendOverlay', {
        before: this.$el,
        onClick: this.close
      })
    },
    removeOverlay () {
      if (this.overlayElement) {
        this.overlayElement.removeEventListener('click', this.close)
        this.overlayElement.remove()
      }
    },
    close () {
      this.$emit('input', false)
    },
    onOpen () {
      this.$emit('open')
      this.$nextTick(() => {
        utility.requestParent(this, 'appendChild', {
          el: this.$el
        })
        if (this.overlay) {
          this.addOverlay()
          this.focus()
          this.addHash()
        }
      })
    },
    valueHandler (value) {
      if (value) {
        return this.onOpen()
      }
      return this.onClose()
    },
    onCancel () {
      if (this.value && this.overlay) {
        this.close()
      }
    },
    onClose () {
      this.$emit('close')
      this.$nextTick(() => {
        if (this.overlay && !this.value) {
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
    value (value) {
      this.valueHandler(value)
    }
  },
  beforeDestroy () {
    this.removeHash()
    this.removeOverlay()
    this.$el.remove()
  },
  mounted () {
    this.valueHandler(this.value)
  }
}

</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-dialog {
  @include shadow(bottom, $shadow-color-light);

  backface-visibility: hidden;
  height: auto;
  min-width: 200px;
  overflow: auto;
  position: absolute;
  border-radius: $border-radius;
  max-height: 100%;
  max-width: 100%;
  padding: 0;
  z-index: 3;

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
