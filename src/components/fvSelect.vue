<template lang="pug">
fv-inputbox.fv-select(:invalid="!fvValidate",
  :style="colorsCssVars",
  :placeholder="placeholder",
  :disabled="disabled",
  :value="value",
  :input="search !== false",
  @input-keydown="onKeydown",
  @typing="onSearch",
  :multiple="multiple",
  :search-query.sync="searchQuery",
  @value-delete="deleteValue",
  @blur="searchQuery = ''",
  :delete-button="deleteButton",
  :caret-icon="caretIcon",
  ref="inputBox")
  template(slot="value",
    slot-scope="scope")
    slot(v-if="$scopedSlots.value || $slots.value", name="value", :value="scope.value", :option="valueProp(scope.value)")
    span(v-else) {{valueProp(scope.value, 'text')}}
  template(slot="out")
    .fv-padding.fv-text-center(v-if="loading")
      fv-loading
    fv-list(v-else,
      color="primary"
      :tabindex="-1",
      parent,
      ref="list")
      fv-list-item(v-for="(option, i) in filteredOptions",
        :class="{selected: isSelectedOption(option)}",
        :disabled="optionProp(option, 'disabled')",
        :key="i",
        @click="clickOption(option)")
          slot(v-if="$scopedSlots.option || $slots.option", name="option", :option="option")
          span(v-else, v-text="optionProp(option, 'text')")
      fv-list-item(v-if="allowInsert && searchQuery",
        @click="onInsert(searchQuery)")
        slot(v-if="$scopedSlots.insert || $slots.insert", name="insert", :value="searchQuery")
        span(v-else)
          span.insert-icon(v-html="insertIcon")
          =" "
          u(v-text="searchQuery")
      fv-list-item.unclickable(v-else-if="filteredOptions.length === 0")
        slot(v-if="$scopedSlots.empty || $slots.empty", name="empty", :value="searchQuery")
        span(v-else) ---
</template>

<script>
import fvInputbox from './fvInputbox.vue';
import colorMixin from '../mixins/color.js';
import caretIcon from '../icons/ARR.svg';
import insertIcon from '../icons/CLS.svg';

export default {
  components: {
    fvInputbox,
  },
  mixins: [
    colorMixin({
      color: 'background',
    }),
  ],
  props: {
    value: {
      default: undefined,
    },
    options: {
      type: Array,
      default: () => [],
    },
    disabledKey: {
      type: String,
      default: 'disabled',
    },
    valueKey: {
      type: String,
      default: 'value',
    },
    textKey: {
      type: String,
      default: 'text',
    },
    required: {
      type: [Boolean, Function],
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    search: {
      type: [Object, Boolean],
      validator: (value) => [true, false, null].indexOf(value) > -1,
      default: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    allowInsert: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    deleteButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isFocused: false,
      searchQuery: '',
      caretIcon,
      insertIcon,
    };
  },
  computed: {
    filteredOptions() {
      return this.options.filter((option) => {
        if (this.search === true) {
          if (JSON.stringify(option).toUpperCase().indexOf(this.searchQuery.toUpperCase()) !== -1) {
            return true;
          }
          return false;
        }
        return true;
      });
    },
    fvValidate() {
      if (this.required === true) {
        if (typeof this.value === 'undefined' || (this.value instanceof Array && this.value.length === 0)) {
          return false;
        }
        return true;
      } if (typeof this.required === 'function') {
        return this.required(this.value);
      }
      return true;
    },
  },
  methods: {
    focus() {
      this.$refs.inputBox.focus();
    },
    setStructure() {
      if (this.multiple && (typeof this.value === 'undefined' || !(this.value instanceof Array))) {
        this.$emit('input', []);
      }
    },
    onInsert(userString) {
      this.$emit('insert', userString);
      this.searchQuery = '';
    },
    onSearch() {
      if (this.$refs.list) {
        this.$refs.list.moveHighlight(null);
      }
      this.$emit('search', this.searchQuery);
    },
    optionProp(option, prop) {
      if (!prop) {
        return option;
      }
      switch (prop) {
        case 'value':
          return this.valueKey ? option[this.valueKey] : option;
        case 'text':
          return this.textKey ? option[this.textKey] : option;
        case 'disabled':
          return this.disabledKey ? option[this.disabledKey] : false;
      }
    },
    valueProp(value, prop) {
      const founded = this.options.find((option) => this.optionProp(option, 'value') === value);
      if (!prop) {
        return founded;
      }
      if (typeof founded !== 'undefined') {
        return this.optionProp(founded, prop);
      }
      return value;
    },
    clickOption(option) {
      if (this.isSelectedOption(option) && this.multiple) {
        const optionValue = this.optionProp(option, 'value');
        this.deleteValue(optionValue);
      } else {
        this.selectOption(option);
      }
      this.searchQuery = '';
    },
    selectOption(option) {
      let newValue;
      const optionValue = this.optionProp(option, 'value');
      if (this.multiple) {
        newValue = [...this.value, optionValue];
      } else {
        newValue = optionValue;
      }
      this.$emit('input', newValue);
    },
    deleteValue(value) {
      if (this.multiple) {
        if (typeof value === 'undefined') {
          this.$emit('input', []);
        } else {
          const newValue = JSON.parse(JSON.stringify(this.value));
          const indexOf = newValue.findIndex((selectedValue) => JSON.stringify(selectedValue) === JSON.stringify(value));
          if (indexOf !== -1) {
            newValue.splice(indexOf, 1);
          }
          this.$emit('input', newValue);
        }
      } else {
        this.$emit('input', undefined);
      }
    },
    isSelectedOption(option) {
      if (typeof this.value === 'undefined') {
        return false;
      }
      if (this.multiple) {
        const indexOf = this.value.findIndex((selectedValue) => JSON.stringify(selectedValue) === JSON.stringify(this.optionProp(option, 'value')));
        if (indexOf !== -1) {
          return true;
        }
        return false;
      }
      return this.optionProp(option, 'value') === this.valueProp(this.value, 'value');
    },
    onKeydown(event) {
      switch (event.which) {
        case 37: // left
        case 38: // up
        case 39: // right
        case 40: // down
        case 13: // enter
          if (this.$refs.list) {
            this.$refs.list.onKeydown(event);
          }
          break;
        case 8: // backspace
          if (this.searchQuery.length === 0 && this.deleteButton) {
            if (this.multiple) {
              if (this.value.length) {
                this.deleteValue(this.value[this.value.length - 1]);
              }
            } else {
              this.deleteValue();
            }
          }
          break;
        case 46: // delete
          this.searchQuery = '';
          if (this.deleteButton) {
            this.deleteValue();
          }
      }
    },
  },
  created() {
    this.setStructure();
  },
  watch: {
    value() {
      this.$nextTick(() => {
        if (!this.multiple) {
          this.$refs.inputBox.close();
        } else {
          this.$refs.inputBox.focus();
        }
      });
    },
  },
};
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

  & .insert-icon > svg {
    transform: rotateZ(45deg);
    vertical-align: middle;
    width: 1em;
  }
}
</style>
