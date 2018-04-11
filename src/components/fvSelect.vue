<template lang="pug">
fv-inputbox(:value="multiple ? value : (typeof value !== 'undefined' ? [value] : [])",
  :placeholder="typeof value === 'undefined' || value.length === 0 ? placeholder : ''",
  :disabled="disabled",
  caret-icon="fa fa-caret-down",
  @enter="open()",
  delete-button,
  @value-delete="clickOption",
  ref="inputEl")
  template(slot="value",
    slot-scope="scope")
    slot(v-if="$scopedSlots.value", name="value", :value="scope.value", :option="singleValueOption(scope.value)")
    span(v-else) {{valueProp(scope.value, 'text')}}
  fv-dialog.fv-select(slot="out",
    ref="dialog",
    :class="dialogClass",
    :left.sync="dialogPosition.left",
    :top.sync="dialogPosition.top",
    :width="dialogPosition.width",
    @close="$emit('close')",
    @open="$emit('open')",
    :first-focus-on="firstFocusOn",
    :auto-close="false")
    fv-header(v-if="showInput")
      fv-input.fv-grow(:placeholder="placeholder || locale.search()",
        v-model="searchQuery",
        @input="$emit('search', searchQuery)",
        @keydown.native="$refs.list.onKeydown($event)",
        ref="input")
    fv-content.fv-no-padding
      .fv-text-center.fv-padding(v-if="loading")
        i.loading-icon.fa.fa-spin.fa-circle-o-notch.fv-fast-animation
      fv-list.fv-no-border(v-else,
        :tabindex="-1",
        parent,
        ref="list")
        fv-list-item(v-for="option in options",
          :key="optionProp(option, 'value')",
          v-if="equalSearch(option)",
          @click="clickOption(option)",
          :selected="isSelected(option)",
          :disabled="optionProp(option, 'disabled')")
          slot(v-if="$scopedSlots.option", name="option", :option="option", :selected="isSelected(option)")
          span(v-else) {{optionProp(option, 'text')}}
        fv-list-item(v-if="allowInsert && searchQuery",
          @click="addOption(searchQuery)")
          i.fa.fa-plus
          =" "
          | {{locale.add(searchQuery)}}
    fv-footer(v-if="multiple || allowInsert")
      .fv-grow
      fv-button.fv-ok(icon="fa fa-check",
        :text="locale.ok()",
        @click="close()")
</template>

<script>
import utility from '../utility'
import locale from 'locale'
import fvMain from './fvMain.vue'
import fvHeader from './fvHeader.vue'
import fvContent from './fvContent.vue'
import fvDialog from './fvDialog.vue'
import fvInput from './fvInput.vue'
import fvList from './fvList.vue'
import fvListItem from './fvListItem.vue'

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
      locale,
      searchQuery: '',
      firstFocusOn: false,
      dialogPosition: {}
    }
  },
  computed: {
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
    },
    showInput () {
      return this.search !== false || this.allowInsert
    }
  },
  methods: {
    setValue (value) {
      this.$emit('input', value)
    },
    open () {
      if (typeof this.value !== 'undefined') {
        if (!(this.value instanceof Array) && this.multiple) {
          this.setValue([this.value])
        }
      } else {
        this.setValue(this.multiple ? [] : undefined)
      }
      const offset = utility.offsetTo(this.$el, utility.fvParent(this, 'fv-main').$el)
      this.dialogPosition = {
        left: `${offset.left}px`,
        top: `${offset.top}px`,
        width: `${this.$refs.inputEl.$el.offsetWidth}px`
      }
      this.searchQuery = ''
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
    singleValueOption (value) {
      const founded = this.options.findIndex(option => this.optionProp(option, 'value') === value)
      if (founded !== -1) {
        return this.options[founded]
      }
      const option = this.valueKey ? {} : value
      if (this.valueKey) {
        option[this.valueKey] = value
      }
      if (this.textKey) {
        option[this.textKey] = value
      }
      return option
    },
    valueProp (value, prop = 'value') {
      const founded = this.options.findIndex(option => this.optionProp(option, 'value') === value)
      if (founded !== -1) {
        return this.optionProp(this.options[founded], prop)
      }
      return value
    },
    addOption (value, select = true) {
      const options = JSON.parse(JSON.stringify(this.options))
      const founded = options.findIndex(option => this.optionProp(option, 'value') === value)
      let option
      if (founded === -1) {
        option = this.valueKey ? {} : ''
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
        this.$emit('insert-option', option)
      } else {
        option = options[founded]
      }

      if (select) {
        this.clickOption(option)
      }
      this.searchQuery = ''
      this.$refs.input.$el.focus()
    },
    clickOption (option) {
      let newValue = this.value
      if (this.multiple) {
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
      } else if (this.showInput) {
        this.$refs.input.$el.focus()
      }
    },
    equalSearch (option) {
      if (this.search !== true ||
        !this.searchQuery ||
        utility.contains(this.optionProp(option, 'value'), this.searchQuery) ||
        utility.contains(this.optionProp(option, 'text'), this.searchQuery)) {
        return true
      }
      return false
    }
  },
  mounted () {
    this.firstFocusOn = !utility.isSmallViewport()
  }
}
</script>
