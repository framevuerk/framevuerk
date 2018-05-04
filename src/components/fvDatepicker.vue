<template lang="pug">
fv-inputbox.fv-datepicker(:placeholder="typeof value !== 'undefined' ? '' : placeholder",
  :invalid="!fvValidate",
  :required="required",
  :disabled="disabled",
  :value="typeof value !== 'undefined' ? [value] : []",
  :delete-button="true",
  @value-delete="$emit('input', undefined)",
  caret-icon="fa fa-calendar-o",
  @enter="open()",
  ref="inputEl")
  template(slot="value", slot-scope="scope")
    slot(v-if="$scopedSlots.value", name="value", :value="scope.value")
    span(v-else) {{scope.value}}
  fv-dialog.fv-datepicker-dialog(slot="out",
    ref="dialog",
    :class="dialogClass",
    :left.sync="dialogPosition.left",
    :top.sync="dialogPosition.top",
    width="300px",
    @close="$emit('close')",
    @open="$emit('open')",
    :first-focus-on="false",
    :auto-close="false")
    fv-header.header(height="4em", tabindex="0", @keydown.native="onHeaderKeydown")
      .fv-input-group.header-buttons
        fv-button.fv-sm(@click="moveValue('year', -1)", :icon="icons.prevYear", tabindex="-1")
        fv-button.fv-sm(@click="moveValue('month', -1, false)", :icon="icons.prevMonth", tabindex="-1")
      .title.fv-text-center
        h4 {{visualProps.month}}/{{visualProps.year}}
      .fv-input-group.header-buttons
        fv-button.fv-sm(@click="moveValue('month', 1, false)", :icon="icons.nextMonth", tabindex="-1")
        fv-button.fv-sm(@click="moveValue('year', 1)", :icon="icons.nextYear", tabindex="-1")
    fv-content.content(tabindex="0", @keydown.native="onContentKeydown")
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
import fvMain from './fvMain.vue'
import fvContent from './fvContent.vue'
import fvDialog from './fvDialog.vue'
import fvInput from './fvInput.vue'
import fvInputbox from './fvInputbox.vue'

export default {
  components: {
    fvMain,
    fvContent,
    fvDialog,
    fvInput,
    fvInputbox
  },
  props: {
    value: {
      default: undefined
    },
    dialogClass: {
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
    placeholder: {
      type: String,
      default: ''
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
      dialogPosition: {},
      highlightedDate: null
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
    setEditingValue () {
      this.editingValue = new this.Date(this.value || Date.now())
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
    open () {
      this.setEditingValue()
      this.calcVisualProps()
      const offset = utility.offsetTo(this.$el, utility.fvParent(this, 'fv-main').$el)
      this.dialogPosition = {
        left: `${offset.left}px`,
        top: `${offset.top}px`
      }
      this.$refs.dialog.open()
    },
    close () {
      this.$refs.dialog.close()
    },
    focus () {
      this.$refs.inputEl.$el.focus()
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
    moveValue (unit, value, emit = false) {
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
      const ret = new this.Date(this.editingValue)
      if (emit) {
        this.$emit('input', this.value && ret.toString() === this.value.toString() ? undefined : ret)
        this.close()
      }
      this.calcVisualProps()
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
        this.close()
      }
      this.calcVisualProps()
    },
    onContentKeydown (event) {
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
      }
      this.calcVisualProps()
    },
    onHeaderKeydown (event) {
      switch (event.which) {
        case 38: // up
          event.preventDefault()
          this.moveValue('year', -1)
          break
        case 40: // down
          event.preventDefault()
          this.moveValue('year', 1)
          break
        case process.env.direction === 'ltr' ? 37 : 39: // 37: left, 39: right,
          event.preventDefault()
          this.moveValue('month', -1)
          break
        case process.env.direction === 'ltr' ? 39 : 37: // 37: left, 39: right,
          event.preventDefault()
          this.moveValue('month', 1)
          break
      }
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

.fv-datepicker-dialog {
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

    &:focus:not(:hover) {
      & table {
        & th {
          color: $primary-color;
        }

        & td {
          &.highlighted {
            background: yiq($bg-color, 3%);

            &.selected {
              background: yiq($primary-color, 3%);
            }
          }
        }
      }
    }
  }
}
</style>
