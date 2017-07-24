import utility from '../../utility'
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
      pValue: undefined,
      localItems: [],
      searchText: locale.search(),
      pShow: false,
      searchQuery: '',
      highlightedOption: null
    }
  },
  computed: {
    fvValidate () {
      return this.$refs.inputEl.fvValidate || false
    },
    showInput () {
      return this.search || this.allowInsert
    },
    displayValue () {
      let ret = []
      this.options.concat(this.localItems).forEach(option => {
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
          icon: 'fa fa-plus-circle',
          text: locale.add(this.searchQuery),
          class: 'fv-default fv-block',
          action: () => {
            this.localItems.push(this.searchQuery)
            this.searchQuery = ''
            utility.doIt(() => {
              this.$refs.list.highlightedOption = this.$refs.list.pItems.length - 1
              if (this.showInput) {
                this.$refs.input.$el.focus()
              } else {
                this.$refs.list.$el.focus()
              }
            })
          }
        })
      } else {
        ret.push({
          icon: 'fa fa-times',
          text: locale.cancel(),
          class: 'fv-default',
          action: () => {
            this.close()
          }
        })
        ret.push({
          icon: 'fa fa-check',
          text: locale.ok(),
          class: 'fv-primary',
          action: () => {
            this.$emit('input', this.pValue)
            this.close()
          }
        })
      }
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
    clickItem (item) {
      const value = item.value || item || ''
      let newValue = this.pValue
      if (this.multiple) {
        newValue = this.pValue
        if (this.pIsSelected(value)) {
          if (!this.required || this.pValue.length > 1) {
            newValue.splice(newValue.indexOf(value), 1)
          }
        } else {
          newValue.push(value)
        }
      } else {
        if (this.pIsSelected(value)) {
          if (!this.required) {
            newValue = undefined
          }
        } else {
          newValue = value
        }
      }
      this.pValue = newValue
      this.searchQuery = ''
    }
  },
  render: template.render
}
