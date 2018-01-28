<template lang="pug">
span
  transition(name="fv-fade")
    .fv-overlay(v-if="visible && !isPinned",
      @click="close()")
  transition(:name="animationName")
    aside.fv-main.fv-sidebar(v-if="visible",
      :style="{ width: width}",
      :class="classList",
      ref="sidebar")
      slot
</template>

<script>
import utility from '../utility'

export default {
  props: {
    width: {
      type: String,
      default: '250px'
    },
    position: {
      type: String,
      validator: (value) => {
        return ['right', 'left'].indexOf(value) > -1
      },
      default: process.env.config.direction === 'ltr' ? 'left' : 'right'
    },
    pin: {
      type: [Object, Boolean],
      validator: (value) => {
        return [true, false, null].indexOf(value) > -1
      },
      default: null
    }
  },
  data () {
    return {
      isRendered: false,
      visible: false,
      isPinned: false,
      parentMain: null,
      focusBackElem: null
    }
  },
  computed: {
    animationName () {
      if (this.isRendered === true) {
        return `fv-sidebar-${this.position}`
      } else {
        return ''
      }
    },
    classList () {
      return {
        'left': this.position === 'left',
        'right-border': this.position === 'left' && this.isPinned,
        'right': this.position === 'right',
        'left-border': this.position === 'right' && this.isPinned
      }
    }
  },
  methods: {
    open () {
      this.parentMain.appendChild(this.$el)
      this.visible = true
      if (this.isPinned) {
        this.parentMain.style[`padding${utility.capitalizeFirstLetter(this.position)}`] = this.width
      } else {
        this.focusBackElem = document.querySelector(':focus')
        utility.doIt(() => {
          const focusableItems = this.$el.querySelectorAll('select, input, textarea, button, [tabindex]:not([tabindex=""])')
          if (focusableItems.length) {
            focusableItems[0].focus()
          }
        })
      }
      this.$emit('open')
    },
    close () {
      this.visible = false
      this.parentMain.style[`padding${utility.capitalizeFirstLetter(this.position)}`] = '0px'
      if (!this.isPinned && this.focusBackElem) {
        this.focusBackElem.focus()
      }
      this.$emit('close')
    },
    toggle () {
      this[this.visible ? 'close' : 'open']()
    }
  },
  created () {
    this.isRendered = false
  },
  mounted () {
    // find parentMain
    let el = this.$parent.$el
    do {
      if (el.classList.contains('fv-main')) {
        break
      } else {
        el = el.parentElement
      }
    } while (el !== null)
    this.parentMain = el

    // set width
    if (this.pin === null) {
      this.isPinned = !utility.isSmallViewport()
    } else {
      this.isPinned = this.pin
    }

    if (this.isPinned) {
      this.open()
    } else {
      this.close()
    }

    utility.doIt(() => {
      this.isRendered = true
    })
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.fv-sidebar {
  backface-visibility: hidden;
  height: 100%;
  max-width: 80%;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  top: 0;

  &.right {
    right: 0;
  }

  &.right-border {
    border-right: solid 1px $shadow-color;
  }

  &.left {
    left: 0;
  }

  &.left-border {
    border-left: solid 1px $shadow-color;
  }

  &.fv-sidebar-left-enter-active,
  &.fv-sidebar-left-leave-active,
  &.fv-sidebar-right-enter-active,
  &.fv-sidebar-right-leave-active {
    transform: translate3d(0, 0, 0);
    transition-duration: $transition-speed;
    transition-property: transform;
    transition-timing-function: ease;
    will-change: transform;
  }

  &.fv-sidebar-left-enter,
  &.fv-sidebar-left-leave-active {
    transform: translate3d(-100%, 0, 0);
  }

  &.fv-sidebar-right-enter,
  &.fv-sidebar-right-leave-active {
    transform: translate3d(100%, 0, 0);
  }
}
</style>
