<template lang="pug">
span
  transition(name="fv-fade")
    .fv-overlay(v-if="visible && !isPinned",
      @click="close()")
  transition(:name="animationName")
    aside.fv-main.fv-sidebar(v-if="visible",
      :style="{ width: width }",
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
      visible: false,
      focusBackElem: null
    }
  },
  computed: {
    animationName () {
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
    open () {
      this.bigParent().$el.appendChild(this.$el)
      this.visible = true
      if (this.isPinned) {
        this.bigParent().$el.style[`padding${utility.capitalizeFirstLetter(this.actualPosition)}`] = this.width
      } else {
        this.focusBackElem = document.querySelector(':focus')
        this.$nextTick(() => {
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
      this.bigParent().$el.style[`padding${utility.capitalizeFirstLetter(this.actualPosition)}`] = '0px'
      if (!this.isPinned && this.focusBackElem) {
        this.focusBackElem.focus()
      }
      this.$emit('close')
    },
    toggle () {
      this[this.visible ? 'close' : 'open']()
    },
    bigParent () {
      let ret = this
      while (ret) {
        if (ret.parent) {
          return ret
        }
        ret = ret.$parent
      }
      return false
    }
  },
  mounted () {
    if (this.isPinned) {
      this.open()
    } else {
      this.close()
    }

    this.$nextTick(() => {
      this.isRendered = true
    })
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-sidebar {
  @include yiq($sidebar-bg-color);

  backface-visibility: hidden;
  height: 100%;
  max-width: 80%;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  top: 0;
  z-index: 2;

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
