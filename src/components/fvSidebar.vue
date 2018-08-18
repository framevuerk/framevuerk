<template lang="pug">
  fv-dialog.fv-sidebar.not-center(:class="classList",
    :animation="animation",
    :visible="visible",
    @update:visible="$emit('update:visible', $event)",
    :overlay="!pin",
    top="0px",
    @open="onOpen",
    @close="onClose")
    slot
</template>

<script>
import utility from '../utility'

export default {
  props: {
    position: {
      type: String,
      validator: (value) => {
        return ['right', 'left'].indexOf(value) > -1
      },
      default: process.env.direction === 'ltr' ? 'left' : 'right'
    },
    visible: {
      type: Boolean
    },
    pin: {
      type: Boolean
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
    getMain () {
      if (!this.main) {
        this.main = utility.fvParent(this, 'fv-main')
      }
      return this.main
    },
    fixSize () {
      if (this.pin) {
        const main = this.getMain()
        const size = this.visible ? `${this.$el.offsetWidth}px` : 0
        main.setOffset(this.position, size)
      }
    },
    onOpen () {
      this.$nextTick(() => {
        this.fixSize()
      })
    },
    onClose () {
      this.$nextTick(() => {
        this.fixSize()
      })
    }
  },
  mounted () {
    window.addEventListener('resize', this.fixSize)
    const main = utility.fvParent(this, 'fv-main')
    if (utility.viewportSize(main.$el).indexOf('lg') === -1) {
      this.$emit('update:pin', false)
      this.$emit('update:visible', false)
    } else {
      this.$emit('update:pin', true)
      this.$emit('update:visible', true)
    }
    this.fixSize()
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
