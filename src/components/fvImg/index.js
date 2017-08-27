import utility from '../../utility'
import template from './template.pug'
import style from './style.scss'
/* global process */

export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    src: {
      type: [Array, String],
      default: () => []
    },
    width: {
      type: [Number, String],
      default: '100%'
    },
    height: {
      type: [Number, String],
      default: '25em'
    },
    nav: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      hammer: undefined,
      index: this.value || 0,
      timer: null,
      animationName: 'fv-img-prev',
      dirs: {
        next: process.env.DIRECTION === 'ltr' ? 'left' : 'right',
        prev: process.env.DIRECTION === 'ltr' ? 'right' : 'left'
      }
    }
  },
  computed: {
    size () {
      return {
        width: typeof this.width === 'number' ? `${this.width}px` : this.width,
        height: typeof this.height === 'number' ? `${this.height}px` : this.height
      }
    },
    pNav () {
      if (!this.nav || this.images.length < 2) {
        return false
      }
      return true
    },
    images () {
      const ret = []
      if (typeof this.src === 'string') {
        ret.push(this.imageObj(this.src))
      } else {
        this.src.forEach(src => {
          ret.push(this.imageObj(src))
        })
      }
      return ret
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
    imageObj (src) {
      return {
        image: typeof src === 'string' ? src : src.image || '',
        caption: {
          text: typeof src === 'string' ? '' : (src.caption ? src.caption.text || src.caption || src.caption.text : ''),
          class: typeof src === 'string' ? 'bottom' : (src.caption ? src.caption.class || 'bottom' : 'bottom')
        }
      }
    },
    focus () {
    },
    getUrl (src) {
      return `url("${src}")`
    },
    moveIndex (num = 1) {
      const newIndex = this.index + num
      if (newIndex >= this.images.length) {
        this.index = 0
      } else if (newIndex < 0) {
        this.index = this.images.length - 1
      } else {
        this.index = newIndex
      }
    },
    initerval () {
      clearInterval(this.timer)
      if (this.interval > 0 && this.images.length > 1) {
        this.timer = setInterval(() => {
          this.moveIndex(1)
        }, this.interval)
      } else {
        clearInterval(this.timer)
      }
    },
    initHammer () {
      if (this.hammer && this.images.length > 1) {
        const mc = new this.hammer.Manager(this.$el, {
          recognizers: [
            [this.hammer.Swipe, { direction: this.hammer.DIRECTION_HORIZONTAL }]
          ]
        })
        mc.on(`swipe${this.dirs.next}`, () => {
          this.moveIndex(1)
        })
        mc.on(`swipe${this.dirs.prev}`, () => {
          this.moveIndex(-1)
        })
      }
    }
  },
  created () {
    this.hammer = utility._dependencies.hammer
  },
  mounted () {
    this.initerval()
    this.initHammer()
  },
  watch: {
    interval () {
      this.initerval()
    },
    index (newIndex, oldIndex) {
      this.$emit('input', newIndex)
      const lastIndex = this.images.length - 1
      if (newIndex === lastIndex && oldIndex === 0) {
        this.animationName = `fv-img-${this.dirs.prev}`
      } else if (newIndex > oldIndex || (newIndex === 0 && oldIndex === this.images.length - 1)) {
        this.animationName = `fv-img-${this.dirs.next}`
      } else {
        this.animationName = `fv-img-${this.dirs.prev}`
      }
      this.initerval()
    },
    src () {
      this.initerval()
      this.initHammer()
    },
    value () {
      if (this.value !== this.index) {
        this.index = this.value
      }
    }
  },
  style,
  render: template.render
}
