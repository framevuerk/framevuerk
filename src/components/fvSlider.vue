<template lang="pug">
fv-main.fv-slider
  .tabs-container(v-if="showTabs")
    fv-button.fv-sm.fv-grow(v-for="(i, slot) in $slots",
      :key="'button' + slot + i",
      :class="{'fv-selected': value === slot}",
      @click.prevent="setValue(slot)")
      slot(v-if="$scopedSlots.button || $slots.button", :value="slot", name="button")
      span(v-else) {{slot}}
  fv-content.slider-page(@mousedown.native="moveStart($event)",
    @touchstart.native="moveStart($event)",
    ref="sliderContainer")
    transition-group(:name="animationName")
      fv-content.slider-page(v-for="(i, slot) in $slots",
        :key="'content' + slot + i",
        v-show="slot === value")
        slot(:name="slot")
  fv-button.fv-xl.next(v-if="showButtons",
    @click.prevent="moveSlide(true)")
    .icon(v-html="icons.next")
  fv-button.fv-xl.prev(v-if="showButtons",
    @click.prevent="moveSlide(false)")
    .icon(v-html="icons.prev")
  ul.nav(v-if="showNavs")
    li(v-for="(i, slot) in $slots",
      :key="'nav' + slot + i",
      @click.prevent="setValue(slot)",
      :class="{selected: value === slot}")
</template>

<script>
import fvMain from './fvMain.vue'
import fvHeader from './fvHeader.vue'
import fvContent from './fvContent.vue'
import fvButton from './fvButton.vue'

export default {
  components: {
    fvMain,
    fvHeader,
    fvContent,
    fvButton
  },
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
    interval: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      timer: null,
      animationName: 'fv-slider-prev',
      startX: 0,
      blockStart: process.env.direction === 'ltr' ? 'left' : 'right',
      blockEnd: process.env.direction === 'ltr' ? 'right' : 'left'
    }
  },
  computed: {
    items () {
      return Object.keys(this.$slots)
    },
    currentIndex () {
      return this.items.findIndex(slide => slide === this.value)
    },
    icons () {
      const chevronLeft = require('../icons/feather/chevron-left.svg')
      const chevronRight = require('../icons/feather/chevron-right.svg')
      return {
        next: this.blockStart === 'left' ? chevronRight : chevronLeft,
        prev: this.blockStart === 'left' ? chevronLeft : chevronRight
      }
    }
  },
  methods: {
    calcXByEvent (event) {
      return event.changedTouches && event.changedTouches.length ? event.changedTouches[0].clientX : (event.pageX - 0)
    },
    calcDirection (startX, endX) {
      const calced = startX - endX
      return {
        moveNext: this.blockStart === 'left' ? calced > 0 : calced < 0,
        x: calced
      }
    },
    moveStart (event) {
      this.startX = this.calcXByEvent(event)
      this.bindEvents()
    },
    moveEnd (event) {
      this.unbindEvents()
      const endX = this.calcXByEvent(event)
      const direction = this.calcDirection(this.startX, endX)
      if (Math.abs(direction.x) < 70) {
        return
      }
      this.moveSlide(direction.moveNext)
    },
    bindEvents () {
      document.body.addEventListener('mouseup', this.moveEnd)
      document.body.addEventListener('touchend', this.moveEnd)
    },
    unbindEvents () {
      document.body.removeEventListener('mouseup', this.moveEnd)
      document.body.removeEventListener('touchend', this.moveEnd)
    },
    setValue (value, next = null) {
      const newIndex = this.items.findIndex(slide => slide === value)
      if (!this.value) {
        this.animationName = ''
      } else if (next === null) {
        this.animationName = `fv-slider-${newIndex >= this.currentIndex ? this.blockStart : this.blockEnd}`
      } else if (next) {
        this.animationName = `fv-slider-${this.blockStart}`
      } else {
        this.animationName = `fv-slider-${this.blockEnd}`
      }
      this.initerval()
      this.$emit('input', value)
    },
    moveSlide (next = true) {
      let newIndex = this.currentIndex + (next ? 1 : -1)
      if (newIndex >= this.items.length) {
        newIndex = 0
      } else if (newIndex < 0) {
        newIndex = this.items.length - 1
      }
      this.setValue(this.items[newIndex], next)
    },
    initerval () {
      clearTimeout(this.timer)
      if (this.interval > 0 && this.items.length > 1) {
        this.timer = setTimeout(() => {
          this.moveSlide(true)
        }, this.interval)
      }
    }
  },
  mounted () {
    this.initerval()
    if (!this.value) {
      this.setValue(this.items[0])
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-slider {
  overflow: hidden;
  backface-visibility: hidden;

  & .slider-page {
    padding: 0;
    overflow-x: hidden;
    float: $block-start;
  }

  & > .tabs-container {
    @include shadow(bottom);

    padding: 0;
    border-bottom: solid 1px contrast($bg-color, 2);
    display: flex;
    height: 3.5em;
    flex-direction: row;

    & > .fv-button {
      height: 100%;
      border-right: 0;
      border-left: 0;
      border-radius: 0;
      box-shadow: none;
      border-bottom: solid 0.4em transparent;
      border-top: solid 0.4em transparent;
      font-weight: bold;
      transition-duration: $transition-speed-fast;
      transition-property: color, border;

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
      border-radius: 5px;
      cursor: pointer;
      display: inline-block;
      height: 10px;
      margin: 0.8em 0.2em;
      width: 10px;

      &.selected {
        background: $primary-color;
        box-shadow: 0 0 15px $primary-color-light;
        cursor: default;
      }
    }
  }
}

.fv-slider-fade-enter-active,
.fv-slider-fade-leave-active,
.fv-slider-right-enter-active,
.fv-slider-right-leave-active,
.fv-slider-left-enter-active,
.fv-slider-left-leave-active {
  transform: translateX(0);
  transition-duration: $transition-speed-slow;
  transition-property: transform, opacity;
  will-change: transform, opacity;
}

.fv-slider-left-enter {
  transform: translateX(100%) !important;
  z-index: 1;
}

.fv-slider-right-enter {
  transform: translateX(-100%) !important;
  z-index: 1;
}

.fv-slider-fade-leave-active,
.fv-slider-fade-leave-to,
.fv-slider-right-leave-active,
.fv-slider-right-leave-to,
.fv-slider-left-leave-active,
.fv-slider-left-leave-to {
  opacity: 1;
  position: absolute;
}

.fv-slider-fade-leave-active,
.fv-slider-fade-leave-to {
  opacity: 0;
}

.fv-slider-right-leave-active,
.fv-slider-right-leave-to {
  transform: translateX(100%) !important;
  opacity: 0;
  z-index: 2;
}

.fv-slider-left-leave-active,
.fv-slider-left-leave-to {
  transform: translateX(-100%) !important;
  opacity: 0;
  z-index: 2;
}
</style>
