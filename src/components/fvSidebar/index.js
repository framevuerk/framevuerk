import utility from '../../utility'
import template from './template.pug'
import style from './style.scss'
/* global process */

export default {
  props: {
    width: {
      type: Number,
      default: 250
    },
    position: {
      type: String,
      validator: (value) => {
        return ['right', 'left'].indexOf(value) > -1
      },
      default: process.env.DIRECTION === 'ltr' ? 'left' : 'right'
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
      pShow: false,
      isPinned: false,
      parentMain: null,
      focusBackElem: null
    }
  },
  computed: {
    animationName () {
      if (this.isRendered === true) {
        return `fv-sidebar-${this.position}`
      } else {
        return ''
      }
    },
    classList () {
      return {
        'left': this.position === 'left',
        'right-border': this.position === 'left' && this.isPinned,
        'right': this.position === 'right',
        'left-border': this.position === 'right' && this.isPinned
      }
    }
  },
  methods: {
    open () {
      this.parentMain.appendChild(this.$el)
      this.pShow = true
      if (this.isPinned) {
        this.parentMain.style[`padding${utility.capitalizeFirstLetter(this.position)}`] = typeof this.width === 'number' ? `${this.width}px` : this.width
      } else {
        this.focusBackElem = document.querySelector(':focus')
        utility.doIt(() => {
          const focusableItems = this.$el.querySelectorAll('select, input, textarea, button, a, [tabindex]:not([tabindex=""])')
          if (focusableItems.length) {
            focusableItems[0].focus()
          }
        })
      }
      this.$emit('open')
    },
    close () {
      this.pShow = false
      this.parentMain.style[`padding${utility.capitalizeFirstLetter(this.position)}`] = '0px'
      if (!this.isPinned && this.focusBackElem) {
        this.focusBackElem.focus()
      }
      this.$emit('close')
    },
    toggle () {
      this[this.pShow ? 'close' : 'open']()
    }
  },
  created () {
    this.isRendered = false
  },
  mounted () {
    // find parentMain
    let el = this.$parent.$el
    do {
      if (el.classList.contains('fv-main')) {
        break
      } else {
        el = el.parentElement
      }
    } while (el !== null)
    this.parentMain = el

    // set width
    if (this.pin === null) {
      this.isPinned = !utility.isSmallViewport()
    } else {
      this.isPinned = this.pin
    }

    if (this.isPinned) {
      this.open()
    } else {
      this.close()
    }

    utility.doIt(() => {
      this.isRendered = true
    })
  },
  style,
  render: template.render
}
