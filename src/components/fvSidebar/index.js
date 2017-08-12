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
      default: null // or false or true
    }
  },
  data () {
    return {
      pAnimation: null,
      pShow: false,
      pPosition: this.position,
      pWidth: 250,
      pPin: false,
      parentMain: null
    }
  },
  computed: {
    animationName () {
      if (this.pAnimation === true) {
        return `fv-sidebar-${this.pPosition}`
      } else {
        return ''
      }
    }
  },
  watch: {
    position () {
      this.pSetPosition()
    },
    pin () {
      this.pSetPin()
      this.pMainPadding()
    },
    width () {
      this.pSetWidth()
      this.pMainPadding()
    }
  },
  created () {
    this.pAnimation = false
  },
  mounted () {
    let el = this.$refs.sidebar
    do {
      if (el.classList.contains('fv-main')) {
        break
      } else {
        el = el.parentElement
      }
    } while (el !== null)
    this.parentMain = el;

    this.pSetPosition()
    this.pSetWidth()
    this.pSetPin()
    this.pMainPadding()
    setTimeout(() => {
      this.pAnimation = true
    }, 300)
  },
  beforeDestroy () {
    this.bindEvents(false)
  },
  methods: {
    open () {
      if( this.parentMain ){
        //this.parentMain.appendChild(this.$el)
      }
      
      this.pShow = true
      this.pMainPadding()
      this.$emit('open')
    },
    close () {
      this.pShow = false
      this.pMainPadding()
      this.$emit('close')
    },
    toggle () {
      this[this.pShow ? 'close' : 'open']()
    },
    pSetPosition () {
      if (['left', 'right'].indexOf(this.position) !== -1) {
        this.pPosition = this.position
      } else {
        this.pPosition = 'left'
      }
    },
    widthChangeEvent () {
      const width = (window.innerWidth > 0) ? window.innerWidth : screen.width
      if (width < 992) {
        this.pPin = false
        this.close()
      } else {
        this.pPin = true
        this.open()
      }
    },
    bindEvents (set = true) {
      if (set) {
        this.widthChangeEvent()
        window.addEventListener('resize', this.widthChangeEvent)
        window.addEventListener('orientationChange', this.widthChangeEvent)
      } else {
        window.removeEventListener('resize', this.widthChangeEvent)
        window.removeEventListener('orientationChange', this.widthChangeEvent)
      }
    },
    pSetPin () {
      this.pPin = this.pin
      if (this.pPin === true) {
        this.bindEvents(false)
        this.open()
      } else if (this.pPin === false) {
        this.bindEvents(false)
        this.close()
      } else {
        this.bindEvents(true)
      }
    },
    pSetWidth () {
      if (typeof this.width === 'number' && this.width > 0) {
        this.pWidth = this.width
      }
    },
    pMainPadding () {
      if (this.parentMain === null) {
        return false
      }
      const paddingDir = `padding${(this.position === 'right' ? 'Right' : 'Left')}`
      if (this.pPin && this.pShow) {
        this.parentMain.style[paddingDir] = this.pWidth + 'px'
      } else {
        this.parentMain.style[paddingDir] = ''
      }
      return true
    }
  },
  style,
  render: template.render
}
