<template lang="pug">
span
  fv-input(:class="inputClass",
    :display-value="displayValue",
    :placeholder="placeholder",
    :required="required",
    :disabled="disabled",
    :value="value",
    render-type="display",
    caret-icon="fa fa-calendar-o",
    @enter="open()",
    ref="inputEl")
  fv-dialog.fv-datepicker(ref="dialog",
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
        fv-button.fv-sm.text-focus(@click="moveValue('year', -1)", :icon="icons.prevYear", tabindex="-1")
        fv-button.fv-sm.text-focus(@click="moveValue('month', -1, false)", :icon="icons.prevMonth", tabindex="-1")
      .title.fv-text-center
        h4 {{visualProps.month}}/{{visualProps.year}}
      .fv-input-group.header-buttons
        fv-button.fv-sm.text-focus(@click="moveValue('month', 1, false)", :icon="icons.nextMonth", tabindex="-1")
        fv-button.fv-sm.text-focus(@click="moveValue('year', 1)", :icon="icons.nextYear", tabindex="-1")
    fv-content.content(tabindex="0", @keydown.native="onContentKeydown")
      table.days-table
        tbody
          tr(v-for="dp in [0, 7, 14, 21, 28]")
            td(v-for="d in 7",
              @click="setValue('date', (d + dp) - visualProps.monthFirstDay, true)",
              :disabled="(d + dp) <= visualProps.monthFirstDay || (d + dp) - visualProps.monthFirstDay > visualProps.daysInMonth",
              :class="{highlighted: isHighlighted((d + dp) - visualProps.monthFirstDay), selected: isSelected((d + dp) - visualProps.monthFirstDay)}") {{ (d + dp) > visualProps.monthFirstDay && (d + dp) - visualProps.monthFirstDay <= visualProps.daysInMonth ? (d + dp) - visualProps.monthFirstDay : ''}}
</template>

<script>
import utility from '../utility'
import fvMain from './fvMain.vue'
import fvContent from './fvContent.vue'
import fvDialog from './fvDialog.vue'
import fvInput from './fvInput.vue'

export default {
  components: {
    fvMain,
    fvContent,
    fvDialog,
    fvInput
  },
  props: {
    value: {
      type: Date,
      default: undefined
    },
    inputClass: {
      default: ''
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
    displayFormat: {
      type: Function,
      default: v => v.toString()
    }
  },
  data () {
    return {
      Date: require('../').dependencies['date'] || Date,
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
      return this.$refs.inputEl.fvValidate || false
    },
    displayValue () {
      if (this.value) {
        return this.displayFormat(this.value)
      }
      return undefined
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
    calcVisualProps () {
      this.visualProps = {
        year: this.editingValue.getFullYear(),
        month: this.editingValue.getMonth() + 1,
        date: this.editingValue.getDate(),
        monthFirstDay: new this.Date(this.editingValue.getFullYear(), this.editingValue.getMonth(), 1).getDay(),
        daysInMonth: new this.Date(this.editingValue.getFullYear(), this.editingValue.getMonth() + 1, 0).getDate()
      }
      this.$forceUpdate()
      return this.visualProps
    },
    open () {
      this.setEditingValue()
      this.calcVisualProps()
      const main = utility.fvParent(this, 'fv-main')
      const offset = utility.offsetTo(this.$refs.inputEl.$el, main.$el)
      let content = utility.fvParent(this, 'fv-content')
      while (content) {
        offset.top -= content.$el.scrollTop
        content = utility.fvParent(content, 'fv-content')
      }
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
      return this.value.getDate() === date && this.value.getMonth() === this.editingValue.getMonth() && this.value.getFullYear() === this.editingValue.getFullYear()
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
    setValue (unit, value, emit = false) {
      switch (unit) {
        case 'year':
          this.editingValue.setFullYear(value)
          break
        case 'month':
          this.editingValue.setMonth(value)
          break
        case 'date':
          this.editingValue.setDate(value)
          break
      }
      const ret = new this.Date(this.editingValue)
      if (emit) {
        this.$emit('input', this.value && ret.toString() === this.value.toString() ? undefined : ret)
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
          this.moveValue('date', 0, true)
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
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-datepicker {
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

          &:hover {
            background: yiq($primary-color, 3%);
          }

          &:active {
            background: yiq($primary-color, 5%);
          }
        }

        &:hover {
          background: yiq($bg-color, 3%);
        }

        &:active {
          background: yiq($bg-color, 5%);
        }
      }
    }

    &:focus {
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
