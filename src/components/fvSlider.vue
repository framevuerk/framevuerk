<template lang="pug">
.fv-slider(@mousedown.left="moveStart($event)",
  @touchstart="moveStart($event)")
  div {{value}}
  .tabs-container(v-if="showTabs")
    fv-button.fv-grow(v-for="(slide, i) in slides",
      :key="'tab-' + slide + i",
      :class="{'fv-selected': isSlideInView(i)}",
      @click.prevent="setValue(i)")
      slot(v-if="allSlots['tab-' + slide]", :selected="isSlideInView(i)", :name="'tab-' + slide")
      slot(v-else-if="allSlots.tab", :slide="slide", :selected="isSlideInView(i)", name="tab")
      span(v-else) {{ slide }}
  .outer-container(ref="outerContainer")
    .inner-container(ref="innerContainer")
      .slider-page(v-for="(slide, i) in slides",
        ref="slide"
        :key="'slide-' + slide + i")
        slot(:name="'slide-' + slide",
          :selected="isSlideInView(i)")
  fv-button.fv-size-xl.next(v-if="showButtons",
    @click.prevent="moveValue(true)")
    .icon(:style="{ transform: icons.next }", v-html="icons.icon")
  fv-button.fv-size-xl.prev(v-if="showButtons",
    @click.prevent="moveValue(false)")
    .icon(:style="{ transform: icons.prev }", v-html="icons.icon")
  ul.nav(v-if="showNavs")
    li(v-for="(slide, i) in slides",
      :key="'nav-' + slide + i",
      @click.prevent="setValue(i)",
      :class="{selected: isSlideInView(i)}")
</template>

<script>
import icon from '../icons/ARR.svg'
import parent from '../utility/parent.js'

export default {
  props: {
    value: {
      type: Number,
      default: 0,
      required: true
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
      default: true
    },
    slidesPerPage: {
      type: Number,
      default: 1,
      validator: x => x > 0
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
    // used
    allSlots () {
      return Object.assign(this.$slots, this.$scopedSlots)
    },
    // used
    slides () {
      return Object.keys(this.allSlots).filter(key => key.indexOf('slide-') === 0).map(key => key.replace('slide-', ''))
    },
    // used
    currentIndex () {
      return this.slides.findIndex(slide => slide === this.value)
    },
    // used
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
    // used
    moveStart (event) {
      if (!this.swipeSupport || this.slides.length < 2) {
        return
      }
      this.startX = this.calcXByEvent(event)
      this.$refs.outerContainer.style.height = `${this.$refs.innerContainer.offsetHeight}px`
      this.beforeMove()
      this.bindEvents()
    },
    // used
    moving (event) {
      event.preventDefault()
      const translateX = this.slidesX[this.value] + (this.calcXByEvent(event) - this.startX)
      this.$refs.innerContainer.style.transform = `translateX(${translateX}px)`
    },
    // used
    moveEnd (event) {
      console.log('moveEnd')
      this.unbindEvents()
      event.preventDefault()
      const endX = this.calcXByEvent(event)
      const direction = this.calcDirection(this.startX, endX)
      this.moveValue(Math.abs(direction.x) > 40 ? direction.moveNext : null)
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
    // used
    setValue (value) {
      // this.initerval()
      if (this.value === value) {
        this.onValueChanges()
      } else {
        const lastPosibleIndex = this.slides.length - this.slidesPerPage
        this.$emit('input', value > lastPosibleIndex ? lastPosibleIndex : value)
        // this.onValueChanges() will automaticly called
      }
    },
    // used
    isSlideInView (index) {
      return index < (this.value + this.slidesPerPage) && index >= this.value
    },
    // used
    moveValue (next = true) {
      let newIndex = this.value
      if (next !== null) {
        const lastPosibleIndex = this.slides.length - this.slidesPerPage
        newIndex += next ? 1 : -1
        newIndex = newIndex > lastPosibleIndex ? 0 : newIndex
        newIndex = newIndex < 0 ? (this.slides.length - 1) : newIndex
      }
      console.log('setting value to', this.slides[newIndex])
      this.setValue(newIndex)
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
    // used
    afterMove () {
      this.$refs.innerContainer.style.transitionDuration = null // 0.3s
      setTimeout(() => {
        this.$refs.innerContainer.style.position = null // relative
      }, 500)
    },
    // used
    bindInitialEvents () {
      this.$nextTick(this.calcPositions)
      parent.on('sizechange', this.calcPositions)
    },
    // used
    unbindInitialEvents () {
      parent.off('sizechange', this.calcPositions)
    },
    changesEffect (valueChanges = true) {
      this.slidesChangesEffect()
      if (valueChanges) {
        this.$refs.innerContainer.style.transform = `translateX(${this.slidesX[this.value]}px)`
      }
    },
    // used
    calcPositions () {
      this.beforeMove()
      const eachSlideWidth = this.$refs.outerContainer.offsetWidth / this.slidesPerPage
      // we make a free room inside innerContainer just for make sure that overflow problem will not happens
      this.$refs.innerContainer.style.width = `${(this.slides.length + 1) * 100}%`
      for (let i = 0; i < this.slides.length; i++) {
        this.$refs.slide[i].style.width = `${eachSlideWidth}px`
      }
      this.slides.forEach((v, index) => {
        this.slidesX[index] = -1 * (eachSlideWidth * index)
      })

      this.$refs.innerContainer.style.transform = `translateX(${this.slidesX[this.value]}px)`

      this.afterMove()
    },
    onValueChanges() {
      console.log('value changed')
      this.calcPositions()
    }
  },
  // beforeDestroy () {
  //   this.unbindInitialEvents()
  // },
  // updated () {
  //   this.changesEffect()
  // },
  watch: {
    value () {
      this.onValueChanges()
    }
  },
  mounted () {
    // this.initerval()
    
    // check if value is not presented
    this.setValue(this.value)
    // if (this.currentIndex === -1) {
    //   this.setValue(this.slides[0])
    // }

    // bind initial events to recalc positions
    this.bindInitialEvents()
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
