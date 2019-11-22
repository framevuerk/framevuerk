<template lang="pug">
transition(name="fv-sidebar")
  .fv-sidebar(:class="classList",
    :style="colorsCssVars",
    v-show="value",
    @input="$emit('input', $event)",
    :overlay="!isPinned")
    .content
      slot
</template>

<script>
import parent from '../utility/parent.js'
import colorMixin from '../mixins/color.js'

export default {
  mixins: [
    colorMixin({
      color: 'background'
    })
  ],
  props: {
    value: {
      type: Boolean
    },
    pin: {
      type: [Boolean, Object],
      validator: (value) => {
        return [true, false, null].indexOf(value) > -1
      },
      default: null
    }
  },
  data () {
    return {
      isPinned: this.pin || false
    }
  },
  computed: {
    classList () {
      const position = this.getPosition()
      return {
        left: position === 'left',
        right: position === 'right',
        pin: this.isPinned,
        unpin: !this.isPinned
      }
    }
  },
  watch: {
    value (value) {
      if (!this.isPinned) {
        if (value) {
          parent.lock(this._uid)
          setTimeout(() => {
            parent.on('outsideclick', this.$el, this.close)
          })
        } else {
          parent.unlock(this._uid)
          parent.off('outsideclick', this.$el, this.close)
        }
      }
    }
  },
  methods: {
    close () {
      this.$emit('input', false)
    },
    openRequest () {
      this.$emit('input', true)
    },
    getPosition () {
      if (!this.$el) {
        return process.env.blockStart
      }
      if (this.$el.nextSibling) {
        return process.env.blockStart
      }
      return process.env.blockEnd
    },
    onToggle (value) {
      this.$emit('input', value === 'open')
      this.$emit(value)
    },
    onResize (event) {
      if (this.pin !== null) {
        return
      }
      const isSmall = parent.getSize().indexOf('lg') === -1
      if (this.isPinned === false) {
        this.close()
      }
      if (isSmall) {
        this.isPinned = false
        this.$emit('pinChange', false)
        this.close()
      } else {
        this.isPinned = true
        this.$emit('pinChange', true)
        this.openRequest()
      }
    }
  },
  mounted () {
    parent.on('sizechange', this.onResize)
    this.onResize()
  },
  beforeDestroy () {
    parent.off('sizechange', this.onResize)
    parent.unlock(this._uid)
    parent.off('outsideclick', this.$el, this.close)
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-sidebar {
  background-color: var(--color-normal);
  color: var(--color-text);

  border-radius: 0;
  min-height: 100%;
  top: 0;
  position: static;
  min-width: 15%;
  max-width: 100%;
  margin-left: 0;
  margin-right: 0;
  border: none;
  overflow: auto;

  &.unpin {
    position: fixed;
    z-index: 2;
    height: 100%;
  }

  &.pin {
    box-shadow: none;
  }

  &.left {
    @include shadow(right);

    border-right: solid 1px var(--color-border);
  }

  &.right {
    @include shadow(left);

    border-left: solid 1px var(--color-border);
  }


  &.fv-sidebar-enter-active,
  &.fv-sidebar-leave-active {
    transform: translate3d(0, 0, 0);
    transition-property: transform, opacity;
    transition-timing-function: ease;
    will-change: transform, opacity;
    backface-visibility: hidden;

    &.unpin {
      transition-duration: var(--speed-transition-normal);
    }
  }

  &.fv-sidebar-enter,
  &.fv-sidebar-leave-active {
    &.left {
      transform: translate3d(-100%, 0, 0);
    }

    &.right {
      transform: translate3d(100%, 0, 0);
    }
  }
}
</style>
