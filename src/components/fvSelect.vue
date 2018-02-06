<template lang="pug">
span
  fv-input(:class="inputClass",
    :display-value="displayValue",
    :placeholder="placeholder",
    :required="required",
    :disabled="disabled",
    :value="value",
    render-type="display",
    caret-icon="fa fa-caret-down",
    @enter="open()",
    ref="inputEl")
  fv-dialog.fv-select(ref="dialog",
    :class="dialogClass",
    :left.sync="dialogPosition.left",
    :top.sync="dialogPosition.top",
    :width.sync="dialogPosition.width",
    @close="$emit('close')",
    @open="$emit('open')",
    :first-focus-on="firstFocusOn",
    :auto-close="false")
    fv-header(v-if="showInput")
      fv-input.fv-grow(:placeholder="placeholder || locale.search()",
        v-model="searchQuery",
        @input="$emit('search', searchQuery)",
        @keydown.native="$refs.list.onKeydown($event);",
        ref="input")
    fv-content.fv-no-padding
      .fv-text-center.fv-padding(v-show="loading")
        i.loading-icon.fa.fa-spin.fa-circle-o-notch.fv-fast-animation
      fv-list.fv-no-border(v-show="!loading",
        :tabindex="-1",
        parent,
        ref="list")
        fv-list-item(v-for="option in options",
          :key="optionProp(option, 'value')",
          v-if="equalSearch(option)",
          @click="clickOption(option)",
          :selected="isSelected(option)",
          :disabled="optionProp(option, 'disabled')")
          slot(v-if="$scopedSlots.default", :option="option")
          span(v-else) {{optionProp(option, 'text')}}
        fv-list-item(v-if="allowInsert && searchQuery",
          @click="addOption(searchQuery)")
          i.fa.fa-plus
          =" "
          span {{locale.add(searchQuery)}}
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
      searchQuery: '',
      firstFocusOn: !utility.isSmallViewport(),
      dialogPosition: {}
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
      const main = utility.fvParent(this, 'fv-main')
      const content = utility.fvChild(main, 'fv-content')
      const offset = utility.offsetTo(this.$refs.inputEl.$el, main.$el)
      offset.top -= content ? content.$el.scrollTop : 0
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
    addOption (value, select = true) {
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
      if (select) {
        this.clickOption(option)
      }
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
  }
}
</script>
