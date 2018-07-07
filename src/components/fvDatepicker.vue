<template lang="pug">
fv-inputbox.fv-datepicker(:focus="isFocused",
  @enter="onFocus(true)",
  :invalid="!fvValidate",
  :placeholder="placeholder",
  :disabled="disabled",
  :value="value",
  :input="false",
  @input-keydown="onKeydown",
  @value-delete="deleteValue",
  :delete-button="deleteButton",
  :show-out="isFocused",
  tabindex="",
  @open="onFocus",
  :caret-icon="require('../icons/feather/calendar.svg')",
  ref="inputBox")
  template(slot="value", slot-scope="scope")
    slot(v-if="$scopedSlots.value", name="value", :value="scope.value")
    span(v-else, v-text="defaultFormattedValue")
  .fv-datepicker-box(slot="out")
    fv-header.fv-default.header(tabindex="-1")
      .fv-input-group.header-buttons
        fv-button(@click.prevent="moveValue('year', -1)", tabindex="-1")
          .icon(v-html="icons.prevYear")
        fv-button(@click.prevent="moveValue('month', -1)", tabindex="-1")
          .icon(v-html="icons.prevMonth")
      .title.fv-text-center
        h3(v-text="monthNames[visualProps.month - 1]")
        p(v-text="visualProps.year")
      .fv-input-group.header-buttons
        fv-button(@click.prevent="moveValue('month', 1)", tabindex="-1")
          .icon(v-html="icons.nextMonth")
        fv-button(@click.prevent="moveValue('year', 1)", tabindex="-1")
          .icon(v-html="icons.nextYear")
    fv-content.content(tabindex="-1")
      table.days-table
        thead
          tr
            td(v-for="weekDay in weekDayNames",
              v-html="weekDay")
        tbody
          tr(v-for="dp in [0, 7, 14, 21, 28]")
            td(v-for="d in 7",
              @click="selectDate((d + dp) - visualProps.monthFirstDay, $event)",
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
      isFocused: false,
      weekDayNames: [],
      monthNames: []
    }
  },
  created () {
    this.setEditingValue(true)

    const dt = new this.Date()
    dt.setDate(dt.getDate() - (dt.getDay()))
    for (let i = 0; i < 7; i++) {
      this.weekDayNames.push(dt.toString().toString().split(' ')[0])
      dt.setDate(dt.getDate() + 1)
    }

    dt.setDate(1)
    dt.setMonth(0)
    for (let i = 0; i < 12; i++) {
      this.monthNames.push(dt.toString().replace(/[0-9,۰-۹]/g, '').split(' ').filter(p => !!p)[1])
      dt.setMonth(dt.getMonth() + 1)
    }
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
    defaultFormattedValue () {
      if (this.value) {
        return `${this.value.getDate()}-${this.value.getMonth() + 1}-${this.value.getFullYear()}`
      }
      return ''
    },
    icons () {
      const chevronLeft = require('../icons/feather/chevron-left.svg')
      const chevronRight = require('../icons/feather/chevron-right.svg')
      const chevronsLeft = require('../icons/feather/chevrons-left.svg')
      const chevronsRight = require('../icons/feather/chevrons-right.svg')
      return {
        nextMonth: process.env.direction === 'ltr' ? chevronRight : chevronLeft,
        prevMonth: process.env.direction === 'ltr' ? chevronLeft : chevronRight,
        nextYear: process.env.direction === 'ltr' ? chevronsRight : chevronsLeft,
        prevYear: process.env.direction === 'ltr' ? chevronsLeft : chevronsRight
      }
    }
  },
  methods: {
    onFocus (inputFocus) {
      if (!this.disabled) {
        this.setEditingValue()
        this.calcVisualProps()
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
    setEditingValue (force = false) {
      if (!this.editingValue || force) {
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
    selectDate (value = null, event = null) {
      this.setDate(value)
      if (event.target.getAttribute('disabled') || this.isDateDisabled(this.editingValue.getDate(), this.editingValue.getMonth(), this.editingValue.getFullYear())) {
        return
      }
      const ret = new this.Date(this.editingValue)
      this.$emit('input', ret)
      this.$nextTick(() => {
        this.$refs.inputBox.close()
      })
    },
    setDate (value) {
      if (value !== null) {
        this.editingValue.setDate(value)
      }
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
          this.selectDate(null, event)
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
    max-width: 380px;
    min-width: 380px;
  }
}

.fv-datepicker-box {
  & .header {
    & .header-buttons {
      overflow: visible;

      & > .fv-button {
        padding: 0 7px;
      }
    }
  }

  & .content {
    padding: $padding-small;
    width: 100%;
    text-align: center;

    & table {
      width: 100%;

      & thead td {
        @include nowrap;

        font-size: 0.8em;
        color: contrast($bg-color, 4);
        padding-bottom: #{$padding / 2};
      }

      & tbody td {
        width: 14.2%;
        max-width: 14.2%;
        min-width: 14.2%;
        overflow: hidden;
        height: 40px;
        vertical-align: middle;
        border-radius: $border-radius;
        cursor: pointer;
        padding: $padding / 3;

        &[disabled] {
          @include disabled;

          text-decoration: line-through;
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
</style>
