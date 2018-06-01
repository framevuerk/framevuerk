<template lang="pug">
fv-inputbox.fv-datepicker(:focus="isFocused",
  @enter="onFocus(true)",
  :invalid="!fvValidate",
  :placeholder="typeof value !== 'undefined' ? '' : placeholder",
  :disabled="disabled",
  :value="typeof value !== 'undefined' ? [value] : []",
  @value-delete="deleteValue",
  :delete-button="deleteButton",
  :show-out="isFocused",
  tabindex="",
  caret-icon="fa fa-calendar-o",
  ref="inputBox")
  template(slot="value", slot-scope="scope")
    slot(v-if="$scopedSlots.value", name="value", :value="scope.value")
    span(v-else) {{scope.value}}
  template(slot="in")
    span(tabindex="0",
      @focus="onFocus(false)",
      @blur="onBlur",
      @keydown="onKeydown",
      ref="input")
  .box(slot="out",
    @close="$emit('close')")
    fv-header.header(height="4em", tabindex="-1")
      .fv-input-group.header-buttons
        fv-button.fv-sm(@click.prevent="moveValue('year', -1)", :icon="icons.prevYear", tabindex="-1")
        fv-button.fv-sm(@click.prevent="moveValue('month', -1)", :icon="icons.prevMonth", tabindex="-1")
      .title.fv-text-center
        h4 {{visualProps.month}}/{{visualProps.year}}
      .fv-input-group.header-buttons
        fv-button.fv-sm(@click.prevent="moveValue('month', 1)", :icon="icons.nextMonth", tabindex="-1")
        fv-button.fv-sm(@click.prevent="moveValue('year', 1)", :icon="icons.nextYear", tabindex="-1")
    fv-content.content(tabindex="-1")
      table.days-table
        tbody
          tr(v-for="dp in [0, 7, 14, 21, 28]")
            td(v-for="d in 7",
              @click="setDate((d + dp) - visualProps.monthFirstDay, true)",
              :disabled="isDateDisabled((d + dp) - visualProps.monthFirstDay, editingValue.getMonth(), editingValue.getFullYear())",
              :class="{highlighted: isHighlighted((d + dp) - visualProps.monthFirstDay), selected: isSelected((d + dp) - visualProps.monthFirstDay)}") {{ (d + dp) > visualProps.monthFirstDay && (d + dp) - visualProps.monthFirstDay <= visualProps.daysInMonth ? (d + dp) - visualProps.monthFirstDay : ''}}
</template>

<script>
import utility from '../utility'
import fvButton from './fvButton.vue'
import fvHeader from './fvHeader.vue'
import fvContent from './fvContent.vue'
import fvInputbox from './fvInputbox.vue'

export default {
  components: {
    fvButton,
    fvContent,
    fvHeader,
    fvInputbox
  },
  props: {
    value: {
      default: undefined
    },
    defaultValue: {
      default: Date.now()
    },
    required: {
      type: [Boolean, Function],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    deleteButton: {
      type: Boolean,
      default: true
    },
    dateLibrary: {
      type: [Object, Function]
    }
  },
  data () {
    return {
      Date: this.dateLibrary || require('../').dependencies['date'] || Date,
      editingValue: undefined,
      visualProps: {},
      highlightedDate: null,
      isFocused: false
    }
  },
  created () {
    this.setEditingValue()
  },
  computed: {
    fvValidate () {
      if (this.required === true) {
        if (!this.value) {
          return false
        }
        return true
      } else if (typeof this.required === 'function') {
        return this.required(this.value)
      }
      return true
    },
    icons () {
      return {
        nextMonth: `fa fa-angle-${process.env.direction === 'ltr' ? 'right' : 'left'}`,
        prevMonth: `fa fa-angle-${process.env.direction === 'rtl' ? 'right' : 'left'}`,
        nextYear: `fa fa-angle-double-${process.env.direction === 'ltr' ? 'right' : 'left'}`,
        prevYear: `fa fa-angle-double-${process.env.direction === 'rtl' ? 'right' : 'left'}`
      }
    }
  },
  methods: {
    onFocus (inputFocus) {
      if (!this.disabled) {
        this.setEditingValue()
        this.calcVisualProps()
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
        }
      }, 50)
    },
    deleteValue () {
      this.$emit('input', undefined)
    },
    setEditingValue () {
      if (!this.editingValue) {
        this.editingValue = new this.Date(this.value || this.defaultValue)
      }
    },
    monthFirstDay (month, year) {
      return new this.Date(year, month, 1).getDay()
    },
    daysInMonth (month, year) {
      return new this.Date(year, month + 1, 0).getDate()
    },
    calcVisualProps () {
      this.visualProps = {
        year: this.editingValue.getFullYear(),
        month: this.editingValue.getMonth() + 1,
        date: this.editingValue.getDate(),
        monthFirstDay: this.monthFirstDay(this.editingValue.getMonth(), this.editingValue.getFullYear()),
        daysInMonth: this.daysInMonth(this.editingValue.getMonth(), this.editingValue.getFullYear())
      }
      this.$forceUpdate()
      return this.visualProps
    },
    focus () {
      this.$refs.input.focus()
    },
    isSelected (date) {
      if (!this.value) {
        return false
      }
      const value = new this.Date(this.value)
      return value.getDate() === date && value.getMonth() === this.editingValue.getMonth() && value.getFullYear() === this.editingValue.getFullYear()
    },
    isHighlighted (date) {
      if (!this.editingValue) {
        return false
      }
      return this.editingValue.getDate() === date
    },
    moveValue (unit, value) {
      switch (unit) {
        case 'year':
          this.editingValue.setFullYear(this.editingValue.getFullYear() + value)
          break
        case 'month':
          this.editingValue.setMonth(this.editingValue.getMonth() + value)
          break
        case 'date':
          this.editingValue.setDate(this.editingValue.getDate() + value)
          break
      }
      this.onFocus()
    },
    setDate (value, emit = false) {
      if (value !== null) {
        this.editingValue.setDate(value)
      }
      if (this.isDateDisabled(this.editingValue.getDate(), this.editingValue.getMonth(), this.editingValue.getFullYear())) {
        return
      }
      const ret = new this.Date(this.editingValue)
      if (emit) {
        this.$emit('input', ret)
      }
      this.onFocus()
    },
    onKeydown (event) {
      switch (event.which) {
        case 38: // up
          event.preventDefault()
          this.moveValue('date', -7)
          break
        case 40: // down
          event.preventDefault()
          this.moveValue('date', 7)
          break
        case process.env.direction === 'ltr' ? 37 : 39: // 37: left, 39: right,
          event.preventDefault()
          this.moveValue('date', -1)
          break
        case process.env.direction === 'ltr' ? 39 : 37: // 37: left, 39: right,
          event.preventDefault()
          this.moveValue('date', 1)
          break
        case 13: // enter
          event.preventDefault()
          this.setDate(null, true)
          break
        case 8: // backspace
        case 46: // delete
          if (this.deleteButton) {
            this.deleteValue()
          }
      }
      this.calcVisualProps()
    },
    checkFvValidity (day, month, year) {
      if (typeof this.required === 'function') {
        const dt = new this.Date()
        dt.setDate(day)
        dt.setMonth(month)
        dt.setFullYear(year)
        return this.required(dt)
      }
      return true
    },
    isDateDisabled (day, month, year) {
      return day <= 0 || day > this.daysInMonth(month, year) || !this.checkFvValidity(day, month, year)
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-datepicker {
  & .out-container {
    max-width: 300px;
    min-width: 250px;
  }

  & .box {
    & .header {
      &:focus {
        color: $primary-color;
      }

      & .header-buttons {
        overflow: visible;
      }
    }

    & .content {
      padding: $padding-small;
      width: 100%;
      text-align: center;

      & table {
        width: 100%;

        & td {
          width: 14.2%;
          height: 40px;
          vertical-align: middle;
          border-radius: $border-radius;
          cursor: pointer;

          &[disabled] {
            @include disabled;
          }

          &.highlighted {
            background: yiq($bg-color, 3%);
          }

          &.selected {
            @include yiq($primary-color);

            &:not([disabled]):hover {
              background: yiq($primary-color, 3%);
            }

            &:not([disabled]):active {
              background: yiq($primary-color, 10%);
            }
          }

          &:not([disabled]):hover {
            background: yiq($bg-color, 3%);
          }

          &:not([disabled]):active {
            background: yiq($bg-color, 10%);
          }
        }
      }
    }
  }
}
</style>
