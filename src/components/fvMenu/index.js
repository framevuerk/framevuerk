import template from './template.pug'

export default {
  props: {
    options: {
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
      pParam: null
    }
  },
  computed: {
    pOptions () {
      let ret = []
      this.options.forEach((value, index) => {
        ret.push({
          index: index,
          key: value.key || value.text || value,
          icon: value.icon || false,
          text: value.text || value,
          highlighted: this.highlightedOption === index,
          disabled: value.disabled || false,
          action: value.action || function () {}
        })
      })
      return ret
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
      this.$refs.menu.open(param)
    },
    close () {
      this.$refs.menu.close()
    },
    toggle (domElem = null) {
      this[this.pShow ? 'close' : 'open'](domElem)
    },
    clickOption (option) {
      if (!option.disabled) {
        this.$emit('click-item', option.key, this.pParam)
        option.action(this.pParam)
        if (this.autoClose) {
          this.close()
        }
      }
    },
    highlightOption (option = {index: null}) {
      this.highlightedOption = option.index
    },
    pKeyDown (event) {
      switch (event.which) {
      case 27: // esc
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
