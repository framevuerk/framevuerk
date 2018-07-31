<template lang="pug">
  fv-dialog.fv-sidebar(:class="classList",
    :animation="animation",
    :modal="false",
    :overlay="!isPinned",
    :left="actualPosition === 'left' ? '0px' : null",
    :right="actualPosition === 'right' ? '0px' : null",
    :first-focus-on="true",
    top="0px",
    @open="onOpen",
    @close="onClose",
    ref="sidebar")
    slot
</template>

<script>
import utility from '../utility'

export default {
  props: {
    position: {
      type: [String, Object],
      validator: (value) => {
        return ['right', 'left', null].indexOf(value) > -1
      },
      default: null
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
      main: undefined
    }
  },
  computed: {
    animation () {
      if (this.isRendered === true) {
        return `fv-sidebar-${this.actualPosition}`
      }
      return ''
    },
    actualPosition () {
      return this.position !== null ? this.position : process.env.direction === 'ltr' ? 'left' : 'right'
    },
    classList () {
      return {
        'left': this.actualPosition === 'left',
        'right-border': this.actualPosition === 'left' && this.isPinned,
        'right': this.actualPosition === 'right',
        'left-border': this.actualPosition === 'right' && this.isPinned
      }
    },
    isPinned () {
      if (this.pin === null) {
        const main = utility.fvParent(this, 'fv-main')
        return utility.viewportSize(main.$el).indexOf('lg') !== -1
      }
      return this.pin
    }
  },
  methods: {
    getMain () {
      if (!this.main) {
        this.main = utility.fvParent(this, 'fv-main')
      }
      return this.main
    },
    fixSize () {
      if (this.isPinned) {
        this.$nextTick(() => {
          const main = this.getMain()
          setTimeout(() => {
            const size = this.$refs.sidebar.visible ? `${this.$el.offsetWidth}px` : 0
            console.log(size, this.$refs.sidebar.visible)
            main.setOffset(this.actualPosition, size)
          })
        })
      }
    },
    onOpen () {
      console.log('opeeeen')
      this.$nextTick(() => {
        this.fixSize()
      })
    },
    onClose () {
      console.log('closeeeee')
      this.$nextTick(() => {
        this.fixSize()
      })
    },
    open () {
      this.$refs.sidebar.open()
      this.$emit('open')
    },
    close () {
      this.$refs.sidebar.close()
      this.$emit('close')
    },
    toggle () {
      this.$refs.sidebar.toggle()
    }
  },
  mounted () {
    if (this.isPinned) {
      this.open()
    } else {
      this.close()
    }
    window.addEventListener('resize', this.fixSize)
    this.$nextTick(() => {
      this.isRendered = true
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.fixSize)
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
