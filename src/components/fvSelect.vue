<template lang="pug">
fv-inputbox.fv-select(:focus="isFocused",
  @enter="onFocus(true)",
  :invalid="!fvValidate",
  :placeholder="searchQuery || !isEmpty ? '' : placeholder",
  :disabled="disabled",
  :value="multiple ? value : (typeof value !== 'undefined' ? [value] : [])",
  @value-delete="deleteValue",
  :delete-button="deleteButton",
  :show-out="showList",
  tabindex="",
  caret-icon="fa fa-chevron-down",
  ref="inputBox")
  template(slot="value",
    slot-scope="scope")
    slot(v-if="$scopedSlots.value", name="value", :value="scope.value", :option="valueProp(scope.value)")
    span(v-else) {{valueProp(scope.value, 'text')}}
  template(slot="in")
    input.input(v-model="searchQuery",
      v-if="search !== false",
      @focus="onFocus(false)",
      @blur="onBlur",
      :disabled="disabled"
      @keydown="onKeydown",
      @input="onSearch",
      :size="searchQuery.length || 1",
      ref="input")
    span(v-else,
      tabindex="0",
      @focus="onFocus(false)",
      @blur="onBlur",
      @keydown="onKeydown",
      ref="input")
  .box(slot="out")
    .fv-padding.fv-text-center(v-if="loading")
      i.loading-icon.fa.fa-spin.fa-circle-o-notch.fv-fast-animation
    fv-list.fv-no-border(v-else,
      :tabindex="-1",
      parent,
      ref="list")
      fv-list-item(v-for="(option, i) in filteredOptions",
        :key="i",
        @click="selectOption(option)")
          slot(v-if="$scopedSlots.option", name="option", :option="option")
          span(v-else, v-text="optionProp(option, 'text')")
      fv-list-item(v-if="allowInsert && searchQuery",
        @click="onInsert(searchQuery)")
        i.fa.fa-plus
        =" "
        span(v-text="locale.add(searchQuery)")
</template>

<script>
import locale from 'locale'
import utility from '../utility'
import fvInputbox from './fvInputbox.vue'
import fvList from './fvList.vue'
import fvListItem from './fvListItem.vue'

export default {
  components: {
    fvInputbox,
    fvList,
    fvListItem
  },
  props: {
    value: {
      default: undefined
    },
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
    multiple: {
      type: Boolean,
      default: false
    },
    allowInsert: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    deleteButton: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      locale,
      isFocused: false,
      searchQuery: ''
    }
  },
  computed: {
    isEmpty () {
      return typeof this.value === 'undefined' || (this.value instanceof Array && this.value.length === 0)
    },
    filteredOptions () {
      return this.options.filter(option => {
        if (this.isSelectedOption(option)) {
          return false
        }
        if (this.search === true) {
          if (utility.contains(JSON.stringify(option), this.searchQuery)) {
            return true
          }
          return false
        }
        return true
      })
    },
    showList () {
      return !!(this.isFocused && (this.filteredOptions.length || (this.allowInsert && this.searchQuery) || (this.loading)))
    },
    fvValidate () {
      if (this.required === true) {
        if (typeof this.value === 'undefined' || (this.value instanceof Array && this.value.length === 0)) {
          return false
        }
        return true
      } else if (typeof this.required === 'function') {
        return this.required(this.value)
      }
      return true
    }
  },
  methods: {
    focus () {
      this.$refs.input.focus()
    },
    setStructure () {
      if (this.multiple && (typeof this.value === 'undefined' || !(this.value instanceof Array))) {
        this.$emit('input', [])
      }
    },
    onFocus (inputFocus) {
      if (!this.disabled) {
        this.isFocused = true
        if (inputFocus && this.$refs.input) {
          this.$refs.input.focus()
        }
        if (this.$refs.inputBox) {
          this.$refs.inputBox.calcOutPosition()
        }
      }
    },
    onBlur () {
      setTimeout(() => {
        const elem = document.querySelector(':focus')
        if (!elem || !utility.isChildOf(elem, this.$el)) {
          this.isFocused = false
          this.searchQuery = ''
        }
      }, 50)
    },
    onInsert (userString) {
      this.$emit('insert', userString)
      this.searchQuery = ''
    },
    onSearch () {
      if (this.$refs.inputBox) {
        this.$refs.inputBox.calcOutPosition()
      }
      this.$emit('search', this.searchQuery)
    },
    optionProp (option, prop) {
      if (!prop) {
        return option
      }
      switch (prop) {
        case 'value':
          return this.valueKey ? option[this.valueKey] : option
        case 'text':
          return this.textKey ? option[this.textKey] : option
        case 'disabled':
          return this.disabledKey ? option[this.disabledKey] : false
      }
    },
    valueProp (value, prop) {
      const founded = this.options.find(option => this.optionProp(option, 'value') === value)
      if (!prop) {
        return founded
      }
      if (typeof founded !== 'undefined') {
        return this.optionProp(founded, prop)
      }
      return value
    },
    selectOption (option) {
      let newValue
      const optionValue = this.optionProp(option, 'value')
      if (this.multiple) {
        newValue = [...this.value, optionValue]
      } else {
        newValue = optionValue
      }
      this.$emit('input', newValue)
      this.onFocus(true)
      this.searchQuery = ''
    },
    deleteValue (value) {
      if (this.multiple) {
        if (typeof value === 'undefined') {
          this.$emit('input', [])
        } else {
          const newValue = JSON.parse(JSON.stringify(this.value))
          const indexOf = newValue.findIndex(selectedValue => JSON.stringify(selectedValue) === JSON.stringify(value))
          if (indexOf !== -1) {
            newValue.splice(indexOf, 1)
          }
          this.$emit('input', newValue)
        }
      } else {
        this.$emit('input', undefined)
      }
    },
    isSelectedOption (option) {
      if (typeof this.value === 'undefined') {
        return false
      }
      if (this.multiple) {
        const indexOf = this.value.findIndex(selectedValue => JSON.stringify(selectedValue) === JSON.stringify(this.optionProp(option, 'value')))
        if (indexOf !== -1) {
          return true
        }
        return false
      }
      return this.optionProp(option, 'value') === this.valueProp(this.value, 'value')
    },
    onKeydown (event) {
      switch (event.which) {
        case 37: // left
        case 38: // up
        case 39: // right
        case 40: // down
        case 13: // enter
          if (this.$refs.list) {
            this.$refs.list.onKeydown(event)
          }
          break
        case 8: // backspace
          if (this.searchQuery.length === 0 && this.deleteButton) {
            if (this.multiple) {
              if (this.value.length) {
                this.deleteValue(this.value[this.value.length - 1])
              }
            } else {
              this.deleteValue()
            }
          }
          break
        case 46: // delete
          this.searchQuery = ''
          if (this.deleteButton) {
            this.deleteValue()
          }
      }
    }
  },
  created () {
    this.setStructure()
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';

.fv-select {
  & .input {
    border: none;
    background: transparent;
    width: auto;
  }
}
</style>
