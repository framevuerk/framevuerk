<template>
  <fvInputBox
    :placeholder="!parsedValue ? placeholder : ''"
    :search-input="false"
    :disabled="disabled"
    :is-validate="isValidate"
    :auto-close="false"
    @keydown="handleKeydown"
    @focus="onFocusDefault"
    @blur="onBlurDefault"
  >
    <template
      v-if="parsedValue"
      #input
    >
      <span
        css-display="inline-block"
        css-border="md"
        css-radius="md"
        css-padding-start="md"
        css-margin-y="xs"
        css-margin-end="xs"
      >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="parsedValue" />
        <span
          css-cursor="pointer"
          css-border-start="md"
          css-padding-x="md"
          @click="clearValue"
        >
          x
        </span>
      </span>
    </template>
    <template #box>
      <div>
        <template v-if="pick.includes('date')">
          <span @click="currentView = 'years'"> {{ parsedValue.year }} </span>-
          <span @click="currentView = 'months'"> {{ parsedValue.month + 1 }} </span>-
          <span @click="currentView = 'days'"> {{ parsedValue.date }} </span>
        </template>
        <template v-if="pick.includes('time')">
          <span @click="currentView = 'time'">
            {{ parsedValue.hour }}:{{ parsedValue.minute }}
          </span>
        </template>
      </div>
      <table
        v-if="currentView === 'days'"
        :class="$style.daysTable"
      >
        <tbody>
          <tr
            v-for="(daysRow, i) in daysMatrix"
            :key="'days-tr-'+i"
          >
            <td
              v-for="(day, j) in daysRow"
              :key="'days-td-'+j"
              :class="[day.isGray ? 'gray' : null, day.isSelected ? 'selected' : null]"
            >
              {{ day.value }}
            </td>
          </tr>
        </tbody>
      </table>
      <table
        v-if="currentView === 'months'"
        :class="$style.monthsTable"
      >
        <tbody>
          <tr
            v-for="(monthsRow, i) in monthsMatrix"
            :key="'months-tr-'+i"
          >
            <td
              v-for="(month, j) in monthsRow"
              :key="'months-td-'+j"
              :class="[month.isGray ? 'gray' : null, month.isSelected ? 'selected' : null]"
            >
              {{ month.value + 1 }}
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </fvInputBox>
</template>

<doc>
@prop value @type oneOf(Any /* for non-multiple */, Array /* for multiple */) @default undefined @description Value of input.
@prop multiple @type Boolean @default false @description Allow user to select multiple items.
@prop placeholder @type String @default '' @description Showes when value is empty.
@prop required @type Boolean or Function @default false @description If you use this element inside `form` component, the `form` component will reject until this element filled. by passing `false` this check will be skiped and by passing function, you can manualy get current value as an argument and return true/false to allow/reject form submits.
@prop disabled @type Boolean @default false @description Is disabled?

@prop cssColor @type String @default 'background' @description Use any colors that already declared in themeProvider.
@prop cssSize @type oneOf('xs', 'sm', 'md', 'lg', 'xl') @default 'md' @description Size of element.

@event input @params newValue @description Triggers when value changes within component.
</doc>

<example>
@config title 'Default'
@config state true
@config example true

@data val = new Date()
<fvDatepicker v-model="val" placeholder="Sex" />
</example>

<script>
import color from '../mixins/color';
import size from '../mixins/size';
import formElement from '../mixins/formElement';

// const toStatic = JSON.stringify;

export default {
  mixins: [
    color,
    size,
    formElement,
  ],
  inject: ['$theme'],
  props: {
    value: {
      type: [Date, String, Number],
      default: undefined,
      validator: (v) => !v || (new Date(v).getTime()),
    },
    defaultValue: {
      type: [Date, String, Number],
      default: () => new Date(),
      validator: (v) => (new Date(v).getTime()),
    },
    pick: {
      type: Array,
      default: () => ['date'],
      validator: (v) => v.length && v.every((i) => ['date', 'time'].includes(i)),
    },
    dateConstructor: {
      type: Function,
      default: Date,
    },
  },
  data() {
    return {
      localCurrentView: 'days', // days, months, years, time
    };
  },
  computed: {
    Date() {
      return this.dateConstructor;
    },
    currentView: {
      set(x) {
        this.localCurrentView = x;
      },
      get() {
        const allowedList = [
          ...(this.pick.includes('date') ? ['days', 'months', 'years'] : []),
          ...(this.pick.includes('time') ? ['time'] : []),
        ];
        return allowedList.includes(this.localCurrentView) ? this.localCurrentView : allowedList[0];
      },
    },
    parsedValue() {
      let value = new this.Date(this.value);
      if (!value.getTime()) {
        value = new this.Date(this.defaultValue);
      }
      return {
        year: value.getFullYear(),
        month: value.getMonth(),
        date: value.getDate(),
        day: value.getDay(),
        hour: value.getHours(),
        minute: value.getMinutes(),
        seconds: value.getSeconds(),
        millisecond: value.getMilliseconds(),
      };
    },
    daysMatrix() {
      if (!this.pick.includes('date')) return [];
      const ret = [];
      const { year, month } = this.parsedValue;
      const monthFirstDay = this.monthFirstDay(year, month);
      const daysInMonth = this.daysInMonth(year, month);
      const daysInPrevMonth = this.daysInMonth(year, month - 1);
      for (let i = 0; i < 6; i += 1) {
        const row = [];
        const dayStart = i * 7;
        for (let j = 0; j < 7; j += 1) {
          let value = (dayStart + j) - (monthFirstDay - 1);
          let isGray = false;
          if (value < 1) {
            value += daysInPrevMonth;
            isGray = true;
          } else if (value > daysInMonth) {
            value -= daysInMonth;
            isGray = true;
          }
          row.push({
            value,
            isGray,
            isSelected: this.isSelected(year, month, value),
          });
        }
        ret.push(row);
      }
      return ret;
    },
    monthsMatrix() {
      if (!this.pick.includes('date')) return [];
      const ret = [];
      const { year } = this.parsedValue;
      for (let i = 0; i < 4; i += 1) {
        const row = [];
        const monthStart = i * 3;
        for (let j = 0; j < 3; j += 1) {
          const value = monthStart + j;
          row.push({
            value,
            isSelected: this.isSelected(year, value),
          });
        }
        ret.push(row);
      }
      return ret;
    },
    yearsMatrix() {
      if (!this.pick.includes('date')) return [];
      const ret = [];
      const { year } = this.parsedValue;
      for (let i = -13; i < 14; i += 1) {
        const row = [];
        const yearStart = (i * 7) - 3;
        for (let j = 0; j < 7; j += 1) {
          row.push((yearStart + j) + year);
        }
        ret.push(row);
      }
      return ret;
    },
  },
  methods: {
    monthFirstDay(year, month) {
      return new this.Date(year, month, 1).getDay();
    },
    daysInMonth(year, month) {
      return new this.Date(year, month + 1, 0).getDate();
    },
    isSelected(aYear = undefined, aMonth = undefined, aDate = undefined) {
      const { year, month, date } = this.parsedValue;
      const uYear = typeof aYear === 'undefined' ? year : aYear;
      const uMonth = typeof aMonth === 'undefined' ? month : aMonth;
      const uDate = typeof aDate === 'undefined' ? date : aDate;
      return (year - uYear) + (month - uMonth) + (date - uDate) === 0;
    },
    handleKeydown(_event) {
    },
    clearValue() {
      this.$emit('input', undefined);
    },
  },
  style({ className }) {
    const $daySize = this.$theme.sizes.base.factor(this.$size, 'custom', {
      factors: [0, 1, 3, 4, 5, 6],
    });
    // const $monthSize = this.$theme.sizes.base.factor(this.$size, 'custom', {
    //   factors: [0, 1, 3, 4, 5, 6],
    // });
    return [
      className('daysTable', {
        '& td': {
          width: $daySize,
          height: $daySize,
          textAlign: 'center',
          '&.gray': {
            opacity: 0.4,
          },
          '&.selected': {
            background: this.$theme.colors.primary.normal,
          },
        },
      }),
      className('monthsTable', {
        '& td': {
          width: '33.33%',
          textAlign: 'center',
          '&.gray': {
            opacity: 0.4,
          },
          '&.selected': {
            background: this.$theme.colors.primary.normal,
          },
        },
      }),
    ];
  },
};
</script>
