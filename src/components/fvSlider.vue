<template lang="pug">
.fv-slider(@mousedown.left="moveStart($event)",
  @touchstart="moveStart($event)")
  //- div {{ slidesLength }}
  .tabs-container(v-if="showTabs")
    fv-button.fv-grow(v-for="slide in slidesIndex",
      :key="'tab-' + slide",
      :class="{'fv-selected': isSlideInView(slide)}",
      @click.prevent="setValue(slide)")
      slot(v-if="allSlots['tab-' + slide]", :selected="isSlideInView(slide)", :name="'tab-' + slide")
      slot(v-else-if="allSlots.tab", :index="slide", :selected="isSlideInView(slide)", name="tab")
      span(v-else) {{ slide }}
  .outer-container(ref="outerContainer")
    .inner-container(ref="innerContainer")
      slot
    fv-button.fv-size-xl.next(v-if="showButtons",
      @click.prevent="moveValue(true)")
      .icon(:style="{ transform: icons.next }", v-html="icons.icon")
    fv-button.fv-size-xl.prev(v-if="showButtons",
      @click.prevent="moveValue(false)")
      .icon(:style="{ transform: icons.prev }", v-html="icons.icon")
    ul.nav(v-if="showNavs")
      li(v-for="slide in slidesStops",
        :key="'nav-' + slide",
        @click.prevent="setValue(slide)",
        :class="{selected: value === slide}")
  div.interval
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
      updateTimer: null,
      startX: 0,
      slidesLength: 0 // number of slides, calculated durring runtime
    }
  },
  computed: {
    allSlots () {
      return Object.assign(this.$slots, this.$scopedSlots)
    },
    slidesIndex() {
      return new Array(this.slidesLength).fill(undefined).map((x, i) => i)
    },
    slidesStops() {
      const ret = []
      for(let i = 0; i < this.slidesLength; i+=this.slidesPerPage) {
        if (i + this.slidesPerPage > this.slidesLength) {
          ret.push(this.slidesLength - this.slidesPerPage)
        } else {
          ret.push(i)
        }
      }
      return ret
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
    addSlide (slideComponent) {
      this.slides.push(slideComponent)
    },
    removeSlide (slideComponent) {
      this.slides.splice(slideComponent)
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
      if (!this.swipeSupport || this.slidesLength < 2) {
        return
      }
      this.startX = this.calcXByEvent(event)
      this.$refs.outerContainer.style.height = `${this.$refs.innerContainer.offsetHeight}px`
      this.beforeMove()
      this.bindEvents()
    },
    moving (event) {
      event.preventDefault()
      const currentX = parseInt(this.$refs.innerContainer.getAttribute('data-x'))
      const translateX = currentX + (this.calcXByEvent(event) - this.startX)
      this.$refs.innerContainer.style.transform = `translateX(${translateX}px)`
    },
    moveEnd (event) {
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
    setValue (value) {
      if (this.value === value) {
        this.onValueChanges()
      } else {
        let newValue = value
        while (this.slidesStops.indexOf(newValue) === -1 && newValue > 0) {
          newValue--
        }
        this.$emit('input', newValue)
        // this.onValueChanges() will automaticly called after value changes
      }
    },
    isSlideInView (index) {
      return index < (this.value + this.slidesPerPage) && index >= this.value
    },
    moveValue (next = true) {
      let newIndex = this.value
      let stopIndex = this.slidesStops.indexOf(newIndex) || 0
      if (next !== null) {
        stopIndex += next ? 1 : -1
        stopIndex = stopIndex % this.slidesStops.length
        stopIndex = stopIndex < 0 ? this.slidesStops.length - 1 : stopIndex
      }
      newIndex = this.slidesStops[stopIndex]
      this.setValue(newIndex)
    },
    initerval () {
      clearTimeout(this.timer)
      if (this.interval > 0 && this.slidesLength > 1) {
        this.timer = setTimeout(() => {
          this.moveValue(true)
        }, this.interval)
      }
    },
    beforeMove () {
      this.$refs.outerContainer.style.paddingBottom = `${this.$refs.outerContainer.offsetHeight}px`
      this.$refs.innerContainer.style.position = 'absolute'
      this.$refs.innerContainer.style.transitionDuration = '0s'
    },
    afterMove () {
      this.$refs.innerContainer.style.transitionDuration = null // 0.3s
      setTimeout(() => {
        this.$refs.innerContainer.style.position = null // relative
        this.$refs.outerContainer.style.paddingBottom = null // auto
        this.initerval()
      }, 1500) // TODO this should be calculated from transition duration of global config
    },
    bindInitialEvents () {
      this.$nextTick(this.onValueChanges)
      parent.on('sizechange', this.onValueChanges)
    },
    unbindInitialEvents () {
      clearTimeout(this.timer)
      parent.off('sizechange', this.onValueChanges)
    },
    // used of methods, because we dont want to keep this in memory
    getSlidesDom () {
      try {
        return [...this.$el.querySelectorAll('.fv-slide')]
      } catch (e) {
        return []
      }
    },
    onValueChanges () {
      const slidesDom = this.getSlidesDom()
      this.slidesLength = slidesDom.length
      this.$nextTick(() => {
        const eachSlideWidth = this.$refs.outerContainer.offsetWidth / this.slidesPerPage
        this.$refs.innerContainer.style.width = `${(this.slidesLength + 1) * 100}%`
         slidesDom.forEach((slide, index) => {
          slide.style.width = `${eachSlideWidth}px`
          slide.classList[this.isSlideInView(index) ? 'add' : 'remove']('fv-selected')
          if (this.value === index) {
            const x = -1 * (eachSlideWidth * index)
            this.$refs.innerContainer.setAttribute('data-x', x)
            this.$refs.innerContainer.style.transform = `translateX(${x}px)`
          }
        })
        this.afterMove()
      })
    }
  },
  beforeDestroy () {
    this.unbindInitialEvents()
  },
  updated () {
    this.onValueChanges()
  },
  watch: {
    slidesPerPage() {
      this.setValue(0)
    }
  },
  mounted () {
    this.setValue(this.value)
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
    position: relative;
  }

  & .inner-container {
    overflow: visible;
    transition-timing-function: ease;
    transition-duration: $transition-speed;
    transition-property: transform;
    will-change: transform;
    text-align: left;
    /* .fv-slide's are into this section */
  }

  & > .tabs-container {
    @include shadow(bottom);

    padding: 0;
    border-bottom: solid 1px contrast($bg-color, 2);
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    font-size: 0.9em;
    max-width: 100%;
    overflow: hidden;

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
    bottom: $padding / 2;
    left: 0;
    position: absolute;
    text-align: center;
    width: 100%;

    $size: 0.9em;
    & li {
      background: rgba($color, 0.2);
      cursor: pointer;
      height: $size;
      width: $size;
      margin: 0 #{$size / 3};
      display: inline-block;
      border-radius: $size;

      &.selected {
        @include shadow(all, $primary-color-light);
        background: $primary-color;
        cursor: default;
      }
    }
  }
}
</style>
