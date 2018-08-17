<template lang="pug">
fv-inputbox.fv-datepicker(:invalid="!fvValidate",
  :placeholder="placeholder",
  :disabled="disabled",
  :value="value",
  :input="false",
  @input-keydown="onKeydown",
  @value-delete="deleteValue",
  :delete-button="deleteButton",
  tabindex="",
  @open="onOpen",
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
          tr(v-for="dp in 6")
            td(v-for="d in dpRow(dp, editingValue.getMonth(), editingValue.getFullYear())",
              :disabled="d.disabled",
              @click="selectDate(d.date, $event)",
              :class="{highlighted: d.highlighted, selected: d.selected, hidden: d.hidden}",
              v-html="d.realDate")

</template>

<script>
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
    resetTime: {
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
      weekDayNames: [],
      monthNames: []
    }
  },
  created () {
    this.setEditingValue(true)
    const dt = new this.Date()
    dt.setDate(dt.getDate() - (dt.getDay()))
    for (let i = 0; i < 7; i++) {
      this.weekDayNames.push(dt.toString().split(' ')[0])
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
    onOpen () {
      this.setEditingValue(true)
    },
    deleteValue () {
      this.$emit('input', undefined)
    },
    setEditingValue (force = false) {
      if (!this.editingValue || force) {
        this.editingValue = new this.Date(this.value || this.defaultValue)
        this.calcVisualProps()
      }
    },
    monthFirstDay (month, year) {
      return new this.Date(year, month, 1).getDay()
    },
    daysInMonth (month, year) {
      return new this.Date(year, month + 1, 0).getDate()
    },
    calcVisualProps () {
      const visualProps = {
        year: this.editingValue.getFullYear(),
        month: this.editingValue.getMonth() + 1,
        date: this.editingValue.getDate(),
        monthFirstDay: this.monthFirstDay(this.editingValue.getMonth(), this.editingValue.getFullYear()),
        daysInMonth: this.daysInMonth(this.editingValue.getMonth(), this.editingValue.getFullYear())
      }
      this.$set(this, 'visualProps', visualProps)
      return visualProps
    },
    focus () {
      this.$refs.input.focus()
    },
    dpRow (dp, month, year) {
      const calc = (d, dp) => {
        const date = (d + ((dp - 1) * 7)) - this.visualProps.monthFirstDay
        const hidden = !(date > 0 && date <= this.visualProps.daysInMonth)
        let realDate = date
        let realMonth = month
        let realYear = year
        if (date < 1 || date > this.visualProps.daysInMonth) {
          const dt = new this.Date(year, month, date)
          realDate = dt.getDate()
          realMonth = dt.getMonth()
          realYear = dt.getFullYear()
        }
        return {
          date,
          realDate,
          realMonth,
          realYear,
          hidden,
          highlighted: this.isHighlighted(realDate, realMonth, realYear),
          selected: this.isSelected(realDate, realMonth, realYear),
          disabled: this.isDateDisabled(realDate, realMonth, realYear)
        }
      }
      const ret = []
      for (let d = 1; d <= 7; d++) {
        ret.push(calc(d, dp))
      }
      return ret
    },
    isSelected (date, month, year) {
      if (!this.value) {
        return false
      }
      const value = new this.Date(this.value)
      return value.getDate() === date && value.getMonth() === month && value.getFullYear() === year
    },
    isHighlighted (date, month, year) {
      if (!this.editingValue) {
        return false
      }
      return this.editingValue.getDate() === date && this.editingValue.getMonth() === month && this.editingValue.getFullYear() === year
    },
    moveValue (unit, value) {
      const editingValue = new this.Date(this.editingValue)
      switch (unit) {
        case 'year':
          editingValue.setFullYear(editingValue.getFullYear() + value)
          break
        case 'month':
          editingValue.setMonth(editingValue.getMonth() + value)
          break
        case 'date':
          editingValue.setDate(editingValue.getDate() + value)
          break
      }
      this.$set(this, 'editingValue', editingValue)
      this.calcVisualProps()
    },
    selectDate (value = null, event = null) {
      this.setDate(value)
      if (event.target.getAttribute('disabled')) {
        return
      }
      const ret = new this.Date(this.editingValue)
      if (this.resetTime) {
        const timezoneOffset = ret.getTimezoneOffset() * 60000
        ret.setHours(0)
        ret.setMinutes(0)
        ret.setSeconds(0)
        ret.setMilliseconds(0)
        ret.setTime(ret.getTime() - timezoneOffset)
      }
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
    },
    checkFvValidity (day, month, year) {
      if (typeof this.required === 'function') {
        const dt = new this.Date(year, month, day)
        return this.required(dt)
      }
      return true
    },
    isDateDisabled (day, month, year) {
      return !this.checkFvValidity(day, month, year)
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

        &.hidden {
          opacity: 0.3;
        }

        &.highlighted {
          @include yiq(contrast($bg-color, 1));
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
