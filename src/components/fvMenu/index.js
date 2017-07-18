import template from './template.pug'

export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    sheet: {
      type: [Object, Boolean],
      validator: (value) => {
        return [true, false, null].indexOf(value) > -1
      },
      default: null /* or true or false */
    },
    title: {
      type: String,
      default: ''
    },
    autoClose: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      pShow: false,
      pSheet: false,
      highlightedOption: null,
      param: null
    }
  },
  watch: {
    sheet () {
      this.bindEvents()
    }
  },
  created () {
    this.bindEvents()
  },
  methods: {
    open (param = null) {
      this.highlightedOption = null
      this.param = param
      this.$refs.dialog.open()
    },
    close () {
      this.$refs.dialog.close()
    },
    toggle (domElem = null) {
      this[this.pShow ? 'close' : 'open'](domElem)
    },
    clickItem (p1, p2) {
      this.$emit('click-item', p1, p2)
      if (this.autoClose) {
        this.close()
      }
    },
    widthChangeEvent () {
      const width = (window.innerWidth > 0) ? window.innerWidth : screen.width
      if (width < 768) {
        this.pSheet = true
      } else {
        this.pSheet = false
      }
    },
    bindEvents () {
      if (this.sheet === null) {
        this.widthChangeEvent()
        window.addEventListener('resize', this.widthChangeEvent)
        window.addEventListener('orientationChange', this.widthChangeEvent)
      } else {
        window.removeEventListener('resize', this.widthChangeEvent)
        window.removeEventListener('orientationChange', this.widthChangeEvent)
        this.pSheet = this.sheet
      }
    }
  },
  render: template.render
}
