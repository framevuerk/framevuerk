<template lang="pug">
transition(name="fv-menu")
  .fv-menu(v-show="value")
    slot
</template>

<script>
import parent from '../utility/parent.js'
import CancelDetector from '../utility/CancelDetector.js'
import FocusStoler from '../utility/FocusStoler.js'

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      cancelDetector: new CancelDetector(),
      focusStoler: new FocusStoler(),
      lastClickedPosition: null
    }
  },
  methods: {
    valueHandler (value) {
      if (value) {
        this.$emit('open')
        parent.appendChild(this.$el)
        parent.on('outsideclick', this.$el, this.close)
        this.cancelDetector.start(this.close)
        this.$nextTick(() => {
          this.setPosition()
          this.focusStoler.stole(this.$el)
        })
        return
      }
      this.$emit('close')
      parent.off('outsideclick', this.$el, this.close)
      this.cancelDetector.stop()
      this.focusStoler.restore()
    },
    setPosition () {
      if (!this.lastClickedPosition) {
        return
      }
      const offset = this.lastClickedPosition
      const viewport = parent.getViewport()
      // a number between 0 and 1. lowest number is nearest to start direction of block
      const horizontalPosition = offset[process.env.blockStart] / viewport.width
      // it will be one of [0, 1, 2]. lowest number is nearest to top
      const verticalPosition = offset.viewportTop / viewport.height

      const basedOn = {
        nx: horizontalPosition > 0.45 ? process.env.blockStart : process.env.blockEnd,
        x: horizontalPosition > 0.45 ? process.env.blockEnd : process.env.blockStart,
        ny: verticalPosition > 0.7 ? 'top' : 'bottom',
        y: verticalPosition > 0.7 ? 'bottom' : 'top'
      }
      this.$el.style[basedOn.x] = `${offset[basedOn.x]}px`
      this.$el.style[basedOn.ny] = 'auto'
      this.$el.style[basedOn.nx] = 'auto'
      this.$el.style[basedOn.y] = `${offset[basedOn.y]}px`
    },
    close () {
      this.$emit('input', false)
    },
    lastClickPositionHandler (event) {
      const viewport = parent.getViewport()
      const scrollPos = parent.getScrollPosition()
      const offset = {
        left: event.clientX,
        top: event.clientY + scrollPos.top,
        viewportTop: event.clientY
      }
      const scrollBarSize = 15 // not big deal if it's wrong on other browsers
      offset.right = viewport.width - offset.left - scrollBarSize
      offset.bottom = scrollPos.height - offset.top
      this.lastClickedPosition = offset
    }
  },
  watch: {
    value (value) {
      this.valueHandler(value)
    }
  },
  created () {
    parent.on('click', this.lastClickPositionHandler, true)
    parent.on('contextmenu', this.lastClickPositionHandler, true)
  },
  beforeDestroy () {
    parent.off('click', this.lastClickPositionHandler, true)
    parent.off('contextmenu', this.lastClickPositionHandler, true)
    this.$el.remove()
    this.valueHandler(false)
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-menu {
  @include yiq($bg-color);
  @include shadow(bottom);

  backface-visibility: hidden;
  height: auto;
  border: solid 1px contrast($bg-color, 2, hard-dark);
  position: absolute;
  border-radius: $border-radius;
  z-index: 3;

  &.fv-menu-enter-active,
  &.fv-menu-leave-active {
    transform: translate3d(0, 0, 0);
    transition-property: transform, opacity;
    transition-timing-function: ease;
    transition-duration: $transition-speed-fast;
    will-change: transform, opacity;
    backface-visibility: hidden;
  }

  &.fv-menu-enter,
  &.fv-menu-leave-active {
    opacity: 0;
    transform: translate3d(0, -1em, 0);
  }
}
</style>
