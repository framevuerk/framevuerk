import utility from '../../utility'
import locale from 'locale'
import template from './template.pug'
import fvMain from '../fvMain'
import fvHeader from '../fvHeader'
import fvContent from '../fvContent'
import fvDialog from '../fvDialog'
import fvInput from '../fvInput'
import fvList from '../fvList'
import fvListItem from '../fvListItem'

export default {
  components: {
    fvMain,
    fvHeader,
    fvContent,
    fvDialog,
    fvInput,
    fvList,
    fvListItem
  },
  props: {
    options: {
      type: Array,
      default: () => []
    },
    disabledKey: {
      type: String,
      default: 'disabled'
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    textKey: {
      type: String,
      default: 'text'
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
      locale: locale,
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
            const result = this.options.filter(opt => opt[this.valueKey] && opt[this.valueKey] === vl)
            if (result.length) {
              ret.push(result[0][this.textKey])
            } else {
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
          return this.value
        }
      }
      return []
    }
  },
  methods: {
    open () {
      if (typeof this.value !== 'undefined') {
        if (!(this.value instanceof Array) && this.multiple) {
          this.$emit('input', [this.value])
        }
      } else {
        this.$emit('input', this.multiple ? [] : undefined)
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
    isSelected (option) {
      if (this.multiple && this.value !== undefined) {
        return this.value.indexOf(this.optionProp(option, 'value')) !== -1
      } else {
        return this.value === this.optionProp(option, 'value')
      }
    },
    optionProp (option, prop = 'value') {
      switch (prop) {
      case 'value':
        return this.valueKey ? option[this.valueKey] : option
      case 'text':
        return this.textKey ? option[this.textKey] : option
      case 'disabled':
        return this.disabledKey ? option[this.disabledKey] : false
      }
    },
    addOption (value) {
      const options = JSON.parse(JSON.stringify(this.options))
      let option = this.valueKey ? {} : ''
      if (this.valueKey) {
        option[this.valueKey] = value
      } else {
        option = value
      }
      if (this.textKey) {
        option[this.textKey] = value
      }
      options.unshift(option)
      this.$emit('update:options', options)
      this.searchQuery = ''
      this.$refs.input.$el.focus()
    },
    clickOption (option) {
      let newValue = this.value
      if (this.multiple) {
        newValue = this.value
        if (this.isSelected(option)) {
          newValue.splice(newValue.indexOf(this.optionProp(option, 'value')), 1)
        } else {
          newValue.push(this.optionProp(option, 'value'))
        }
      } else {
        if (this.isSelected(option)) {
          if (!this.required) {
            newValue = undefined
          }
        } else {
          newValue = this.optionProp(option, 'value')
        }
      }
      this.$emit('input', newValue)
      this.searchQuery = ''
      if (!this.multiple && !this.allowInsert) {
        this.close()
      }
    },
    equalSearch (option) {
      if (this.search !== true ||
        !this.searchQuery ||
        utility.contains(this.optionProp(option, 'value'), this.searchQuery) ||
        utility.contains(this.optionProp(option, 'text'), this.searchQuery)) {
        return true
      } else {
        return false
      }
    }
  },
  render: template.render
}
