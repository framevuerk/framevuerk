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
      type: [Boolean, Function],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    search: {
      type: [Object, Boolean],
      validator: (value) => {
        return [true, false, null].indexOf(value) > -1
      },
      default: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    allowInsert: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      pValue: undefined,
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
      return this.search !== false || this.allowInsert
    },
    displayValue () {
      if (this.multiple) {
        const ret = []
        if (this.value !== 'undefined' && this.value instanceof Array) {
          this.value.forEach(vl => {
            const result = this.options.filter(opt => (typeof opt.value !== 'undefined' && opt.value && opt.value === vl) || opt === vl)
            if (result.length) {
              ret.push(result[0].text || result[0].value || result[0])
            } else {
              this.$emit('insert', vl, 'value')
              ret.push(vl)
            }
          })
          return ret
        }
      } else if (typeof this.value !== 'undefined') {
        const result = this.options.findIndex(opt => (typeof opt.value !== 'undefined' && opt.value === this.value) || opt === this.value)
        if (result !== -1) {
          return this.options[result].text || this.options[result].value || this.options[result]
        } else {
          this.$emit('insert', this.value, 'value')
          return this.value
        }
      }
      return []
    },
    dialogButtons () {
      const ret = []
      if (this.allowInsert && this.searchQuery) {
        ret.push({
          icon: 'fa fa-plus-circle',
          text: locale.add(this.searchQuery),
          class: 'fv-default fv-block',
          action: () => {
            this.$emit('insert', this.searchQuery, 'user')
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
          class: 'fv-ok',
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
      if (typeof this.value !== 'undefined') {
        if (this.value instanceof  Array) {
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
    focus () {
      this.$refs.inputEl.$el.focus()
    },
    close () {
      this.$refs.dialog.close()
    },
    pIsSelected (value = null) {
      if (this.multiple && this.pValue !== undefined) {
        return this.pValue.indexOf(value) !== -1
      } else {
        return this.pValue === value
      }
    },
    clickItem (item) {
      const value = typeof item.value !== 'undefined' ? item.value : item || ''
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
