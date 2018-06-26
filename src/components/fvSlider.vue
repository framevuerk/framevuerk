<template lang="pug">
fv-main.fv-slider
  .tabs-container(v-if="showTabs")
    fv-button.fv-sm.fv-grow(v-for="(i, slot) in $slots",
      :key="'button' + slot + i",
      :class="{'fv-selected': value === slot}",
      @click.prevent="setValue(slot)")
      slot(v-if="$scopedSlots.button", :value="slot", name="button")
      span(v-else) {{slot}}
  fv-content.slider-page
    transition-group(:name="animationName")
      fv-content.slider-page(v-for="(i, slot) in $slots",
        :key="'content' + slot + i",
        ref="slot",
        v-show="slot === value")
        slot(:name="slot")
  fv-button.fv-xl.next(v-if="showButtons",
    @click.prevent="moveSlide(true)",
    :icon="'fa fa-chevron-'+dirs.prev")
  fv-button.fv-xl.prev(v-if="showButtons",
    @click.prevent="moveSlide(false)",
    :icon="'fa fa-chevron-'+dirs.next")
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
      hammer: undefined,
      timer: null,
      animationName: 'fv-slider-prev',
      dirs: {
        next: process.env.direction === 'ltr' ? 'left' : 'right',
        prev: process.env.direction === 'ltr' ? 'right' : 'left'
      }
    }
  },
  computed: {
    items () {
      return Object.keys(this.$slots)
    },
    currentIndex () {
      return this.items.findIndex(slide => slide === this.value)
    }
  },
  methods: {
    setValue (value, next = null) {
      const newIndex = this.items.findIndex(slide => slide === value)
      if (!this.value) {
        this.animationName = ''
      } else if (next === null) {
        this.animationName = `fv-slider-${newIndex >= this.currentIndex ? this.dirs.next : this.dirs.prev}`
      } else if (next) {
        this.animationName = `fv-slider-${this.dirs.next}`
      } else {
        this.animationName = `fv-slider-${this.dirs.prev}`
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
    initHammer () {
      if (this.hammer && this.items.length > 1) {
        const mc = new this.hammer.Manager(this.$el, {
          recognizers: [
            [this.hammer.Swipe, { direction: this.hammer.DIRECTION_HORIZONTAL }]
          ]
        })
        mc.on(`swipe${this.dirs.next}`, () => {
          this.moveSlide(true)
        })
        mc.on(`swipe${this.dirs.prev}`, () => {
          this.moveSlide(false)
        })
      }
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
  created () {
    this.hammer = require('../').dependencies.hammer
  },
  mounted () {
    this.initerval()
    this.initHammer()
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
    // background: transparent;
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
    transform: translateY(-50%);
    z-index: 3;

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
    z-index: 3;

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
  transform: translateX(30%);
  z-index: 1;
}

.fv-slider-right-enter {
  transform: translateX(-30%);
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
  transform: translateX(50%);
  opacity: 0;
  z-index: 2;
}

.fv-slider-left-leave-active,
.fv-slider-left-leave-to {
  transform: translateX(-50%);
  opacity: 0;
  z-index: 2;
}
</style>
