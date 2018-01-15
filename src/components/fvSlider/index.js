import utility from '../../utility'
import template from './template.pug'
import style from './style.scss'
import fvMain from '../fvMain'
import fvHeader from '../fvHeader'
import fvContent from '../fvContent'
import fvButton from '../fvButton'
/* global process */

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
        next: process.env.DIRECTION === 'ltr' ? 'left' : 'right',
        prev: process.env.DIRECTION === 'ltr' ? 'right' : 'left'
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
    this.hammer = utility._dependencies.hammer
  },
  mounted () {
    this.initerval()
    this.initHammer()
    if (!this.value) {
      this.setValue(this.items[0])
    }
  },
  style,
  render: template.render
}
