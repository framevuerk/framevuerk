import utility from '../../utility'
import template from './template.pug'
import style from './style.scss'
/* global process */

export default {
  props: {
    items: {
      type: Array,
      validator: (value) => {
        return value.length > 0
      }
    },
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
    perSlide: {
      type: Number,
      default: 1
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
      pages: [],
      dirs: {
        next: process.env.DIRECTION === 'ltr' ? 'left' : 'right',
        prev: process.env.DIRECTION === 'ltr' ? 'right' : 'left'
      }
    }
  },
  computed: {
    itemWidth () {
      return 100 / this.perSlide + '%'
    },
    nextPageBtnContent () {
      if (process.env.DIRECTION === 'rtl') {
        return `<i class="fa fa-chevron-left"></i>`
      } else {
        return `<i class="fa fa-chevron-right"></i>`
      }
    },
    prevPageBtnContent () {
      if (process.env.DIRECTION === 'rtl') {
        return `<i class="fa fa-chevron-right"></i>`
      } else {
        return `<i class="fa fa-chevron-left"></i>`
      }
    }
  },
  methods: {
    calcPages () {
      this.items.forEach((item, i) => {
        this.pages[i] = []
        for (let j = i; j < i + this.perSlide; j++) {
          this.pages[i].push(this.items[j % this.items.length])
        }
      })
    },
    moveSlide (slide) {
      if( slide > 0 ){
        this.animationName = `fv-slider-${this.dirs.next}`
      } else {
        this.animationName = `fv-slider-${this.dirs.prev}`
      }

      const currentIndex = this.items.findIndex(slide => slide === this.value)
      let newSlideIndex = currentIndex + slide
      if (newSlideIndex >= this.items.length) {
        newSlideIndex = 0
      } else if (newSlideIndex < 0) {
        newSlideIndex = this.items.length - 1
      }
      this.initerval()
      this.$emit('input', this.items[newSlideIndex])
    },
    initHammer () {
      if (this.hammer && this.items.length > 1) {
        const mc = new this.hammer.Manager(this.$el, {
          recognizers: [
            [this.hammer.Swipe, { direction: this.hammer.DIRECTION_HORIZONTAL }]
          ]
        })
        mc.on(`swipe${this.dirs.next}`, () => {
          this.moveSlide(1)
        })
        mc.on(`swipe${this.dirs.prev}`, () => {
          this.moveSlide(-1)
        })
      }
    },
    initerval () {
      clearInterval(this.timer)
      if (this.interval > 0 && this.items.length > 1) {
        this.timer = setInterval(() => {
          this.moveSlide(1)
        }, this.interval)
      } else {
        clearInterval(this.timer)
      }
    }
  },
  created () {
    this.hammer = utility._dependencies.hammer
    this.calcPages()
  },
  mounted () {
    this.initerval()
    this.initHammer()
    if (!this.value) {
      this.$emit('input', this.items[0])
    }
  },
  watch: {
    interval () {
      this.initerval()
    }
  },
  style,
  render: template.render
}
