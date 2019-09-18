<template lang="pug">
.fv-slider(@mousedown.left="moveStart($event)",
  @touchstart="moveStart($event)")
  .tabs-container(v-if="showTabs")
    fv-button.fv-grow(v-for="(slide, i) in slides",
      :key="'tab-' + slide + i",
      :class="{'fv-selected': value === slide}",
      @click.prevent="setValue(slide)")
      slot(v-if="allSlots['tab-' + slide]", :selected="value === slide", :name="'tab-' + slide")
      slot(v-else-if="allSlots.tab", :slide="slide", :selected="value === slide", name="tab")
      span(v-else) {{slide}}
  .outer-container(ref="outerContainer")
    .inner-container(ref="innerContainer")
      .slider-page(v-for="(slide, i) in slides",
        ref="slide"
        :key="'slide-' + slide + i")
        slot(:name="'slide-' + slide",
          :selected="value === slide")
  fv-button.fv-size-xl.next(v-if="showButtons",
    @click.prevent="moveValue(true)")
    .icon(:style="{ transform: icons.next }", v-html="icons.icon")
  fv-button.fv-size-xl.prev(v-if="showButtons",
    @click.prevent="moveValue(false)")
    .icon(:style="{ transform: icons.prev }", v-html="icons.icon")
  ul.nav(v-if="showNavs")
    li(v-for="(slide, i) in slides",
      :key="'nav-' + slide + i",
      @click.prevent="setValue(slide)",
      :class="{selected: value === slide}")
</template>

<script>
import icon from '../icons/ARR.svg'
import parent from '../utility/parent.js'

export default {
  props: {
    value: {
      default: undefined
    },
    showTabs: {
      type: Boolean,
      default: true
    },
    showNavs: {
      type: Boolean,
      default: false
    },
    showButtons: {
      type: Boolean,
      default: false
    },
    swipeSupport: {
      type: Boolean,
      default: true // should be true
    },
    interval: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      timer: null,
      startX: 0,
      slidesX: []
    }
  },
  computed: {
    allSlots () {
      return Object.assign(this.$slots, this.$scopedSlots)
    },
    slides () {
      return Object.keys(this.allSlots).filter(key => key.indexOf('slide-') === 0).map(key => key.replace('slide-', ''))
    },
    currentIndex () {
      return this.slides.findIndex(slide => slide === this.value)
    },
    icons () {
      return {
        icon,
        next: process.env.direction === 'ltr' ? 'rotate(-90deg)' : 'rotate(90deg)',
        prev: process.env.direction === 'ltr' ? 'rotate(90deg)' : 'rotate(-90deg)'
      }
    }
  },
  methods: {
    slidesChangesEffect () {
      const eachSlideWidth = this.$refs.outerContainer.offsetWidth
      // we make a free room inside innerContainer just for make sure that overflow problem will not happens
      this.$refs.innerContainer.style.width = `${(this.slides.length + 1) * 100}%`
      for (let i = 0; i < this.slides.length; i++) {
        this.$refs.slide[i].style.width = `${eachSlideWidth}px`
      }
      this.slides.forEach((v, index) => {
        this.slidesX[index] = -1 * (eachSlideWidth * index)
      })
    },
    calcXByEvent (event) {
      return event.changedTouches && event.changedTouches.length ? event.changedTouches[0].clientX : (event.pageX - 0)
    },
    calcDirection (startX, endX) {
      const calced = startX - endX
      return {
        moveNext: process.env.blockStart === 'left' ? calced > 0 : calced < 0,
        x: calced
      }
    },
    moveStart (event) {
      if (!this.swipeSupport || this.slides.length < 2) {
        return
      }
      this.startX = this.calcXByEvent(event)
      this.$refs.outerContainer.style.height = `${this.$refs.innerContainer.offsetHeight}px`
      this.beforeMove()
      this.bindEvents()
    },
    moving (event) {
      event.preventDefault()
      const translateX = this.slidesX[this.currentIndex] + (this.calcXByEvent(event) - this.startX)
      this.$refs.innerContainer.style.transform = `translateX(${translateX}px)`
    },
    moveEnd (event) {
      this.unbindEvents()
      event.preventDefault()
      const endX = this.calcXByEvent(event)
      const direction = this.calcDirection(this.startX, endX)
      if (Math.abs(direction.x) < 75) {
        this.afterMove()
        this.changesEffect(false)
      } else {
        this.moveValue(direction.moveNext)
      }
    },
    bindEvents () {
      parent.on('mousemove', this.moving, true)
      parent.on('touchmove', this.moving, true)
      parent.on('mouseup', this.moveEnd, true)
      parent.on('touchend', this.moveEnd, true)
    },
    unbindEvents () {
      parent.off('mousemove', this.moving, true)
      parent.off('touchmove', this.moving, true)
      parent.off('mouseup', this.moveEnd, true)
      parent.off('touchend', this.moveEnd, true)
    },
    setValue (value) {
      this.initerval()
      this.$emit('input', value)
    },
    moveValue (next = true) {
      let newIndex = (this.currentIndex + (next ? 1 : -1)) % this.slides.length
      newIndex = newIndex < 0 ? this.slides.length - 1 : newIndex
      this.setValue(this.slides[newIndex])
    },
    initerval () {
      clearTimeout(this.timer)
      if (this.interval > 0 && this.slides.length > 1) {
        this.timer = setTimeout(() => {
          this.moveValue(true)
        }, this.interval)
      }
    },
    beforeMove () {
      this.$refs.innerContainer.style.position = 'absolute'
      this.$refs.innerContainer.style.transitionDuration = '0s'
    },
    afterMove () {
      this.$refs.innerContainer.style.transitionDuration = null // 0.3s
      setTimeout(() => {
        this.$refs.innerContainer.style.position = null // relative
      }, 500)
    },
    bindInitialEvents () {
      parent.on('sizechange', this.changesEffect)
    },
    unbindInitialEvents () {
      parent.off('sizechange', this.changesEffect)
    },
    changesEffect (valueChanges = true) {
      this.slidesChangesEffect()
      if (valueChanges) {
        this.$refs.innerContainer.style.transform = `translateX(${this.slidesX[this.currentIndex]}px)`
      }
    }
  },
  beforeDestroy () {
    this.unbindInitialEvents()
  },
  updated () {
    this.changesEffect()
  },
  watch: {
    value () {
      this.afterMove()
    }
  },
  mounted () {
    this.initerval()
    if (this.currentIndex === -1) {
      this.setValue(this.slides[0])
    }
    this.bindInitialEvents()
    this.$nextTick(this.changesEffect)
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-slider {
  position: relative;
  width: 100%;
  backface-visibility: hidden;
  overflow: hidden;

  & .outer-container {
    width: 100%;
    min-width: 100%;
    overflow: hidden;
  }

  & .inner-container {
    min-width: 100%;
    overflow: visible;
    transition-timing-function: ease;
    transition-duration: $transition-speed;
    transition-property: transform;
    will-change: transform;
  }

  & .slider-page {
    padding: 0;
    overflow-x: hidden;
    display: inline-block;
    vertical-align: top;
    user-select: none;
  }

  & > .tabs-container {
    @include shadow(bottom);

    padding: 0;
    border-bottom: solid 1px contrast($bg-color, 2);
    display: flex;
    height: 3.5em;
    flex-direction: row;
    font-size: 0.9em;

    & > .fv-button {
      height: 100%;
      border-right: 0;
      border-left: 0;
      border-radius: 0;
      box-shadow: none;
      border-bottom: solid 0.4em transparent;
      border-top: solid 0.4em transparent;

      &.fv-selected {
        border-bottom: solid 0.4em $primary-color;
        border-top: solid 0.4em transparent;
        color: $primary-color;
      }
    }
  }

  & .fv-button.next,
  & .fv-button.prev {
    background: transparent;
    border: 0;
    box-shadow: none;
    position: absolute;
    top: 50%;
    padding: 0 #{$padding / 2};
    transform: translateY(-50%);

    &.next {
      #{$block-end}: 0;
    }

    &.prev {
      #{$block-start}: 0;
    }
  }

  & .nav {
    bottom: 0;
    left: 50%;
    line-height: 1;
    margin: 0 auto;
    position: absolute;
    text-align: center;
    transform: translateX(-50%);
    width: auto;

    & li {
      background: rgba($color, 0.5);
      border-radius: 0.4em;
      cursor: pointer;
      display: inline-block;
      height: 0.8em;
      margin: 0.8em 0.2em;
      width: 0.8em;

      &.selected {
        background: $primary-color;
        box-shadow: 0 0 15px $primary-color-light;
        cursor: default;
      }
    }
  }
}
</style>
