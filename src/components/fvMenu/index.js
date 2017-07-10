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
      pParam: null,
      focusBackElem: null
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
    pFocus (el) {
      if (el === 'back' && this.focusBackElem) {
        this.focusBackElem.focus()
      } else {
        this.$refs.justFocusEl.focus()
      }
    },
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
        case 38: // up
          this.highlightedOption = this.highlightedOption == null ? this.pOptions.length : this.highlightedOption
          this.highlightedOption = this.highlightedOption - 1 < 0 ? this.pOptions.length - 1 : this.highlightedOption - 1
          break
        case 40: // down
          this.highlightedOption = this.highlightedOption == null ? -1 : this.highlightedOption
          this.highlightedOption = this.highlightedOption + 1 >= this.pOptions.length ? 0 : this.highlightedOption + 1
          break
        case 37: case 39: // left, right
          break
        case 13: // enter
          event.preventDefault()
          if (this.highlightedOption !== null) {
            this.clickOption(this.pOptions[ this.highlightedOption ], true)
          }
          break
        case 9: // tab
          event.preventDefault()
          this.pFocus()
          break
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
