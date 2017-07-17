import locale from 'locale'
import template from './template.pug'

export default {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    inputClass: {
      default: ''
    },
    dialogClass: {
      default: ''
    },
    value: {
      default: undefined
    },
    multiple: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    search: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    allowInsert: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      locale,
      pValue: undefined,
      localItems: [],
      pShow: false,
      searchQuery: '',
      highlightedOption: null
    }
  },
  computed: {
    displayValue () {
      let ret = []
      this.options.forEach(option => {
        const value = option.value || option || ''
        const text = option.text || option || ''
        if (this.multiple && this.value && this.value.indexOf(value) !== -1) {
          ret.push(text)
        } else if (value === this.value) {
          ret = text
        }
      })
      return ret
    },
    dialogButtons () {
      const ret = []

      if (this.allowInsert && this.searchQuery) {
        ret.push({
          key: 'insert',
          icon: 'fa fa-check',
          text: locale.add(this.searchQuery),
          class: 'fv-default',
          action: () => {
            this.localItems.push(this.searchQuery)
            this.searchQuery = ''
            this.$refs.list.$el.focus()
          }
        })
      }
      ret.push({
        key: 'reset',
        icon: 'fa fa-circle-o',
        text: locale.selectNone(),
        class: 'fv-default',
        action: () => {
          this.pValue = this.multiple ? [] : undefined
        }
      })
      ret.push({
        key: 'cancel',
        text: locale.cancel(),
        class: 'fv-default',
        action: () => {
          this.close()
        }
      })
      ret.push({
        key: 'ok',
        icon: 'fa fa-check',
        text: locale.ok(),
        class: 'fv-primary',
        action: () => {
          this.$emit('input', this.pValue)
          this.close()
        }
      })
      return ret
    }
  },
  methods: {
    open () {
      if (this.value) {
        if (this.value.constructor === Array) {
          this.pValue = this.value.concat([])
        } else if (this.multiple) {
          this.pValue = [this.value]
        } else {
          this.pValue = this.value
        }
      } else {
        this.pValue = this.multiple ? [] : undefined
      }
      this.searchQuery = ''
      this.highlightedOption = null
      this.$refs.dialog.open()
    },
    close () {
      this.$refs.dialog.close()
    },
    pIsSelected (value = null) {
      if (this.multiple && this.pValue !== null) {
        return this.pValue.indexOf(value) !== -1
      } else {
        return this.pValue === value
      }
    },
    clickItem (item, setHighlight = false) {
      const value = item.value || item || ''
      let newValue = this.pValue
      if (this.multiple) {
        newValue = this.pValue
        if (this.pIsSelected(value)) {
          newValue.splice(newValue.indexOf(value), 1)
        } else {
          newValue.push(value)
        }
      } else {
        newValue = value
      }
      this.pValue = newValue
      this.searchQuery = ''
    }
  },
  render: template.render
}
