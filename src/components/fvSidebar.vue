<template lang="pug">
  fv-dialog.fv-sidebar.not-center(:class="classList",
    :animation="animation",
    :value="value",
    @open="onToggle('open')",
    @close="onToggle('close')",
    @input="$emit('input', $event)",
    :overlay="!pin")
    slot
</template>

<script>
import utility from '../utility'

export default {
  props: {
    value: {
      type: Boolean
    },
    pin: {
      type: Boolean
    },
    position: {
      type: String,
      validator: (value) => {
        return ['right', 'left'].indexOf(value) > -1
      },
      default: process.env.direction === 'ltr' ? 'left' : 'right'
    }
  },
  data () {
    return {
      isRendered: false
    }
  },
  computed: {
    animation () {
      if (this.isRendered === true) {
        return `fv-sidebar-${this.position}`
      }
      return ''
    },
    classList () {
      return {
        'left': this.position === 'left',
        'right-border': this.position === 'left' && this.pin,
        'right': this.position === 'right',
        'left-border': this.position === 'right' && this.pin
      }
    }
  },
  methods: {
    fixSize () {
      this.$nextTick(() => {
        utility.requestParent(this, 'setOffset', {
          position: this.position,
          size: this.value && this.pin ? `${this.$el.offsetWidth}px` : 0
        })
      })
    },
    onToggle (value) {
      this.$emit('input', value === 'open')
      this.$emit(value)
      this.fixSize()
    },
    onResize (event) {
      const parentSize = utility.requestParent(this, 'getSize')
      if (parentSize.indexOf('lg') === -1) {
        if (this.pin !== false) {
          this.$emit('update:pin', false)
          setTimeout(() => {
            if (this.pin === false) {
              this.$emit('input', false)
            }
          })
        }
      } else {
        if (this.pin !== true) {
          this.$emit('update:pin', true)
          setTimeout(() => {
            if (this.pin === true) {
              this.$emit('input', true)
            }
          })
        }
      }
      this.fixSize()
    }
  },
  mounted () {
    window.addEventListener('resize', this.onResize)
    this.onResize()
    this.$nextTick(() => {
      // wait until start position calculated and then active animation
      setTimeout(() => {
        this.isRendered = true
      }, 100)
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-main.fv-sidebar {
  @include yiq($sidebar-bg-color);

  border-radius: 0;
  z-index: 2;
  height: 100%;

  &.right {
    @include shadow(left);

    right: 0;
  }

  &.right-border {
    border-right: solid 1px contrast($sidebar-bg-color, 1, hard-dark);
  }

  &.left {
    @include shadow(right);

    left: 0;
  }

  &.left-border {
    border-left: solid 1px contrast($sidebar-bg-color, 1, hard-dark);
  }

  & .fv-content {
    @include scrollbar($sidebar-bg-color);
  }

  & .fv-list > .fv-list-item {
    & > .content,
    & > .sub-list {
      border-top: solid 1px contrast($sidebar-bg-color, 1);
    }

    &.highlighted > .content,
    &:not(.unclickable) > .content:hover {
      @include yiq(contrast($sidebar-bg-color, 1));
    }
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
