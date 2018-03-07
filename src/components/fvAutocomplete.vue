<template lang="pug">
.fv-autocomplete.fv-input.fv-input-select(:focus="isFocused",
  @click="$refs.inputEl.focus()",
  :invalid="!fvValidate",
  :disabled="disabled")
  span.placeholder(v-if="(typeof value === 'undefined' || (value instanceof Array && value.length === 0)) && !isFocused",
    v-html="placeholder")
  .fv-input-select-item
    span(v-if="multiple",
      v-for="val in value",
      :key="val")
        | {{val}}
        =" "
        i.delete-icon.fa.fa-times(@click="deleteValue(val)")
    span(v-if="!multiple && typeof value !== 'undefined'")
      | {{value}}
      =" "
      i.delete-icon.fa.fa-times(@click="deleteValue()")
    span.transparent
      input.input(v-model="searchQuery",
        @focus="onFocus",
        @blur="onBlur",
        :disabled="disabled"
        @keydown="onKeydown",
        @input="$emit('search', searchQuery)",
        :size="searchQuery.length || 1",
        ref="inputEl")
  span.fv-caret-icon.fa.fa-tags
  .list(v-show="isFocused")
    .fv-padding.fv-text-center(v-if="loading")
      i.loading-icon.fa.fa-spin.fa-circle-o-notch.fv-fast-animation
    fv-list.fv-no-border(v-else,
      :tabindex="-1",
      parent,
      ref="list")
      fv-list-item(v-for="suggestion in suggestions",
        v-if="equalSearch(suggestion) && !loading"
        :key="suggestion",
        @click="clickSuggestion(suggestion)") {{suggestion}}
      fv-list-item(v-if="allowInsert && searchQuery && multiple",
        @click="addSuggestion(searchQuery)")
        i.fa.fa-plus
        =" "
        | {{locale.add(searchQuery)}}
      fv-list-item(v-if="allowInsert && searchQuery && !multiple",
        @click="addSuggestion(searchQuery)")
        | {{searchQuery}}
</template>

<script>
import locale from 'locale'
import utility from '../utility'

export default {
  props: {
    value: {
      default: undefined
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
    suggestions: {
      type: Array,
      default: () => []
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
    fvValidate () {
      if (this.required === true) {
        if (!this.value || (this.value instanceof Array && this.value.length === 0)) {
          return false
        }
        return true
      } else if (typeof this.required === 'function') {
        return this.required()
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
    onFocus () {
      clearTimeout(this.blurTimeout)
      this.isFocused = true
    },
    onBlur () {
      this.blurTimeout = utility.doIt(() => {
        this.isFocused = false
      })
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
      const founded = suggestions.findIndex(suggestion => suggestion === value)
      let suggestion
      if (founded === -1) {
        suggestion = value
        this.$emit('insertSuggestion', suggestion)
      } else {
        suggestion = suggestions[founded]
      }
      this.clickSuggestion(suggestion)
    },
    clickSuggestion (suggestion) {
      let newValue = this.value
      if (this.multiple) {
        if (newValue.indexOf(suggestion) === -1) {
          newValue.push(suggestion)
        }
      } else {
        newValue = suggestion
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
    },
    focus () {
      this.$refs.input.focus()
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
  position: relative;

  & .fv-input-select-item .delete-icon {
    color: yiq($bg-color-dark, 50%);

    &:hover {
      color: yiq($bg-color-dark, 52%);
    }

    &:active {
      color: yiq($bg-color-dark, 60%);
    }
  }

  & .input {
    border: none;
    background: transparent;
    width: auto;
  }

  & .list {
    @include yiq($bg-color);
    @include shadow(bottom);

    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    border: solid 1px darken($bg-color-light, $shadow-percent);
    margin-top: #{$padding / 2};
    border-radius: $border-radius;
    overflow: hidden;
  }
}
</style>
