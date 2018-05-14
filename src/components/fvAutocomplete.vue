<template lang="pug">
fv-inputbox.fv-autocomplete(:focus="isFocused",
  @enter="onFocus(true)",
  :invalid="!fvValidate",
  :placeholder="searchQuery || !isEmpty ? '' : placeholder",
  :disabled="disabled",
  :value="multiple ? value : (typeof value !== 'undefined' ? [value] : [])",
  @value-delete="deleteValue",
  delete-button,
  :show-out="isFocused",
  tabindex="")
  template(slot="value",
    slot-scope="scope")
    slot(v-if="$scopedSlots.value", name="value", :value="scope.value", :suggestion="singleValueSuggestion(scope.value)")
    span(v-else) {{valueProp(scope.value, 'text')}}
  template(slot="in")
    input.input(v-model="searchQuery",
      @focus="onFocus(false)",
      @blur="onBlur",
      :disabled="disabled"
      @keydown="onKeydown",
      @input="$emit('search', searchQuery)",
      :size="searchQuery.length || 1",
      ref="inputEl")
  .list(slot="out")
    .fv-padding.fv-text-center(v-if="loading")
      i.loading-icon.fa.fa-spin.fa-circle-o-notch.fv-fast-animation
    fv-list.fv-no-border(v-else,
      :tabindex="-1",
      parent,
      data-cancel-blur="true",
      ref="list")
      fv-list-item(v-for="(suggestion, i) in suggestions",
        v-if="equalSearch(suggestionProp(suggestion, 'text')) && !loading"
        :key="i",
        @click="clickSuggestion(suggestion)")
          slot(v-if="$scopedSlots.suggestion", name="suggestion", :suggestion="suggestion")
          span(v-else) {{suggestionProp(suggestion, 'text')}}
      fv-list-item(v-if="allowInsert && searchQuery",
        @click="addSuggestion(searchQuery)")
        | {{searchQuery}}
</template>

<script>
import locale from 'locale'
import utility from '../utility'
import fvInputbox from './fvInputbox.vue'

export default {
  components: {
    fvInputbox
  },
  props: {
    value: {
      default: undefined
    },
    suggestions: {
      type: Array,
      default: () => []
    },
    disabledKey: {
      type: String,
      default: ''
    },
    valueKey: {
      type: String,
      default: ''
    },
    textKey: {
      type: String,
      default: ''
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
      default: true
    },
    allowInsert: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      locale,
      isFocused: false,
      searchQuery: '',
      firstFocusOn: false,
      dialogPosition: {},
      blurTimeout: null
    }
  },
  computed: {
    isEmpty () {
      return !this.value || (this.value instanceof Array && this.value.length === 0)
    },
    fvValidate () {
      if (this.required === true) {
        if (!this.value || (this.value instanceof Array && this.value.length === 0)) {
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
    setStructure () {
      if (this.multiple && (typeof this.value === 'undefined' || !(this.value instanceof Array))) {
        this.$emit('input', [])
      }
    },
    onFocus (inputFocus) {
      if (!this.disabled) {
        clearTimeout(this.blurTimeout)
        this.isFocused = true
        if (inputFocus) {
          this.$refs.inputEl.focus()
        }
      }
    },
    onBlur () {
      setTimeout(() => {
        const elem = document.querySelector(':focus')
        if (!elem || !elem.getAttribute('data-cancel-blur')) {
          this.isFocused = false
          this.searchQuery = ''
        }
      })
    },
    suggestionProp (suggestion, prop = 'value') {
      switch (prop) {
        case 'value':
          return this.valueKey ? suggestion[this.valueKey] : suggestion
        case 'text':
          return this.textKey ? suggestion[this.textKey] : suggestion
        case 'disabled':
          return this.disabledKey ? suggestion[this.disabledKey] : false
      }
    },
    singleValueSuggestion (value) {
      const founded = this.suggestions.findIndex(suggestion => this.suggestionProp(suggestion, 'value') === value)
      if (founded !== -1) {
        return this.suggestions[founded]
      }
      const suggestion = this.valueKey ? {} : value
      if (this.valueKey) {
        suggestion[this.valueKey] = value
      }
      if (this.textKey) {
        suggestion[this.textKey] = value
      }
      return suggestion
    },
    valueProp (value, prop = 'value') {
      const founded = this.suggestions.findIndex(suggestion => this.suggestionProp(suggestion, 'value') === value)
      if (founded !== -1) {
        return this.suggestionProp(this.suggestions[founded], prop)
      }
      return value
    },
    deleteValue (item) {
      if (this.multiple) {
        const newValue = this.value
        newValue.splice(newValue.indexOf(item), 1)
        this.$emit('input', newValue)
      } else {
        this.$emit('input', undefined)
      }
    },
    equalSearch (text) {
      if (this.search === false) {
        return false
      }
      if (this.search !== true ||
        !this.searchQuery ||
        utility.contains(text, this.searchQuery)) {
        return true
      }
      return false
    },
    addSuggestion (value) {
      const suggestions = JSON.parse(JSON.stringify(this.suggestions))
      const founded = suggestions.findIndex(suggestion => this.suggestionProp(suggestion, 'value') === value)
      let suggestion
      if (founded === -1) {
        suggestion = this.valueKey ? {} : ''
        if (this.valueKey) {
          suggestion[this.valueKey] = value
        } else {
          suggestion = value
        }
        if (this.textKey) {
          suggestion[this.textKey] = value
        }
        this.$emit('insertSuggestion', suggestion)
      } else {
        suggestion = suggestions[founded]
      }
      this.clickSuggestion(suggestion)
    },
    clickSuggestion (suggestion) {
      const newSuggestion = this.suggestionProp(suggestion, 'value')
      let newValue = this.value
      if (this.multiple) {
        if (newValue.findIndex(val => val === newSuggestion) === -1) {
          newValue.push(newSuggestion)
        }
      } else {
        newValue = newSuggestion
      }
      this.$emit('input', newValue)
      this.searchQuery = ''
      this.$refs.inputEl.focus()
    },
    onKeydown (event) {
      if (event.which === 8 && this.searchQuery.length === 0) {
        let newValue = this.value
        if (this.multiple) {
          newValue.pop()
        } else {
          newValue = undefined
        }
        this.$emit('input', newValue)
      }
      if (this.$refs.list) {
        this.$refs.list.onKeydown(event)
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

.fv-autocomplete {
  & .input {
    border: none;
    background: transparent;
    width: auto;
  }
}
</style>
