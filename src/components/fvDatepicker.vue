<template lang="pug">
fv-inputbox.fv-datepicker(:invalid="!fvValidate",
  :placeholder="placeholder",
  :disabled="disabled",
  :value="value",
  :input="true",
  input-type="tel",
  :search-query.sync="searchQuery",
  @typing="onTyping",
  @input-keydown="onKeydown",
  @value-delete="deleteValue",
  :delete-button="deleteButton",
  @blur="searchQuery = ''",
  tabindex="",
  @open="onOpen",
  :caret-icon="icons.icon",
  ref="inputBox")
  template(slot="value", slot-scope="scope")
    slot(v-if="$scopedSlots.value || $slots.value", name="value", :value="scope.value")
    span(v-else, v-text="defaultFormattedValue")
  .fv-datepicker-box(slot="out")
    .header
      .fv-input-group.header-buttons
        fv-button.fv-size-sm(@click.prevent="moveValue('year', -1)", tabindex="-1")
          .icon(:style="{ transform: icons.prevYear }", v-html="icons.iconY")
        fv-button.fv-size-sm(@click.prevent="moveValue('month', -1)", tabindex="-1")
          .icon(:style="{ transform: icons.prevMonth }", v-html="icons.icon")
      .fv-grow.fv-text-center
        b(v-text="monthNames[visualProps.month - 1]")
        =" "
        span(v-text="visualProps.year")
      .fv-input-group.header-buttons
        fv-button.fv-size-sm(@click.prevent="moveValue('month', 1)", tabindex="-1")
          .icon(:style="{ transform: icons.nextMonth }", v-html="icons.icon")
        fv-button.fv-size-sm(@click.prevent="moveValue('year', 1)", tabindex="-1")
          .icon(:style="{ transform: icons.nextYear }", v-html="icons.iconY")
    .content(tabindex="-1")
      table
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
import icon from '../icons/ARR.svg'
import iconY from '../icons/WRR.svg'

export default {
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
      Date: this.dateLibrary || Date,
      editingValue: undefined,
      visualProps: {},
      weekDayNames: [],
      monthNames: [],
      searchQuery: undefined
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
        const value = new this.Date(this.value)
        return `${value.getDate()}/${value.getMonth() + 1}/${value.getFullYear()}`
      }
      return ''
    },
    icons () {
      return {
        icon,
        iconY,
        nextMonth: process.env.direction === 'ltr' ? 'rotate(-90deg)' : 'rotate(90deg)',
        prevMonth: process.env.direction === 'ltr' ? 'rotate(90deg)' : 'rotate(-90deg)',
        nextYear: process.env.direction === 'ltr' ? 'rotate(-90deg)' : 'rotate(90deg)',
        prevYear: process.env.direction === 'ltr' ? 'rotate(90deg)' : 'rotate(-90deg)'
      }
    }
  },
  methods: {
    onTyping (value) {
      const text = value.toString()
      const digits = value.replace(/[^0-9]/g, '')
      // if use type a seprator
      if (digits.length !== text.length) {
        this.searchQuery = ''
        const editingValue = new this.Date(this.editingValue)
        const number = parseInt(digits)
        if (number.toString().length === 4) {
          editingValue.setFullYear(number)
        } else if (number.toString().length <= 2 && number <= 12 && this.searchQuery !== ' ') {
          editingValue.setMonth(number - 1)
        }
        this.$set(this, 'editingValue', editingValue)
        this.calcVisualProps()
      }
    },
    onOpen () {
      this.searchQuery = ''
      this.setEditingValue(true)
    },
    deleteValue () {
      this.searchQuery = ''
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
      this.$refs.inputBox.focus()
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
    selectDate (value, event) {
      this.setDate(value)
      if (event.target.getAttribute('disabled')) {
        return
      }
      this.searchQuery = ''
      const ret = new this.Date(this.editingValue)
      this.$emit('input', ret)
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
          this.selectDate(parseInt(this.searchQuery) || null, event)
          break
        case 8: // backspace
          if (this.searchQuery.length === 0 && this.deleteButton) {
            this.deleteValue()
          }
          break
        case 46: // delete
          this.searchQuery = ''
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
  },
  watch: {
    value () {
      this.$nextTick(() => {
        this.$refs.inputBox.close()
      })
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';

.fv-datepicker.fv-inputbox {
  & .out-container {
    width: 22em;
  }
}

.fv-datepicker-box {
  & .header {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    padding: padding(sm);

    & .header-buttons {
      overflow: visible;

      & > .fv-button {
        padding: 0 padding(sm);
        border: 0;
        box-shadow: none;
      }
    }
  }

  & .content {
    padding: #{$padding / 2};
    width: 100%;
    text-align: center;

    & table {
      width: 100%;

      & thead td {
        @include nowrap;

        font-size: 0.8em;
        color: contrast($bg-color, 3, light);
        padding-bottom: #{$padding / 2};
      }

      & tbody td {
        width: 14.2%;
        max-width: 14.2%;
        min-width: 14.2%;
        overflow: hidden;
        height: heightSize(sm);
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

        &:not([disabled]):not(.selected) {
          &.highlighted,
          &:hover {
            @include yiq(contrast($bg-color, 1));
          }
        }

        &:not([disabled]).selected {
          @include yiq($primary-color);

          &:hover {
            @include yiq(contrast($primary-color, 1));
          }
        }
      }
    }
  }
}
</style>
