<template>
  <fvInputBox
    :placeholder="!parsedValue ? placeholder : ''"
    :search-input="false"
    :disabled="disabled"
    :is-validate="isValidate"
    :auto-close="false"
    auto-width-box
    @open="handleBoxOpen"
    @keydown="handleKeydown"
    @focus="onFocusDefault"
    @blur="onBlurDefault"
  >
    <template
      v-if="parsedValue.date"
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
      <div :class="$style.box">
        <div v-if="currentView === 'day'">
          <fvInputGroup
            css-flex
            css-padding="sm"
          >
            <div css-padding-end="sm">
              <fvButton
                fab
                css-size="sm"
                @click="setValue({ year: parsedEditingValue.year - 1 }, 'editingValue')"
              >
                {{ $theme.direction.prevChar }}{{ $theme.direction.prevChar }}
              </fvButton>
            </div>
            <div>
              <fvButton
                fab
                css-size="sm"
                @click="setValue({ month: parsedEditingValue.month - 1 }, 'editingValue')"
              >
                {{ $theme.direction.prevChar }}
              </fvButton>
            </div>
            <div
              css-grow
              @click="currentView = currentView === 'time' ? 'day' : 'monthyear'"
              v-text="parsedEditingValue.formattedMonthYear"
            />
            <div>
              <fvButton
                fab
                css-size="sm"
                @click="setValue({ month: parsedEditingValue.month + 1 }, 'editingValue')"
              >
                {{ $theme.direction.nextChar }}
              </fvButton>
            </div>
            <div css-padding-start="sm">
              <fvButton
                fab
                css-size="sm"
                @click="setValue({ year: parsedEditingValue.year + 1 }, 'editingValue')"
              >
                {{ $theme.direction.nextChar }}{{ $theme.direction.nextChar }}
              </fvButton>
            </div>
          </fvInputGroup>
          <table
            :class="$style.dateTable"
            class="day"
            css-padding="sm"
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
                  @click="setValue({ date: day.value, month: day.monthValue, year: parsedEditingValue.year })"
                >
                  {{ day.value }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          v-if="currentView === 'monthyear'"
          css-border-top="md"
        >
          <table
            :class="$style.dateTable"
            class="month"
            css-padding="sm"
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
                  @click="setValue({ month: month.value }, 'editingValue'); currentView = 'day'"
                >
                  {{ month.value + 1 }}
                </td>
              </tr>
            </tbody>
          </table>
          <fvInputGroup
            css-flex
            css-border-top="md"
            css-padding="sm"
          >
            <div>
              <fvButton
                fab
                css-size="sm"
                @click="setValue({ year: parsedEditingValue.year - 1 }, 'editingValue')"
              >
                -
              </fvButton>
            </div>
            <div
              css-grow
              v-text="parsedEditingValue.year"
            />
            <div>
              <fvButton
                fab
                css-size="sm"
                @click="setValue({ year: parsedEditingValue.year + 1 }, 'editingValue')"
              >
                +
              </fvButton>
            </div>
            <!-- <a
              css-padding-x="md"
              @click="setValue({ year: parsedEditingValue.year + 1 }, 'editingValue')"
            >
              {{ $theme.direction.nextChar }}
            </a> -->
          </fvInputGroup>
        </div>
        <fvInputGroup
          v-if="currentView === 'time'"
          css-flex
          css-padding="md"
        >
          <div css-grow>
            <fvButton
              key="h+"
              css-size="sm"
              fab
              @click="setValue({ hour: parsedEditingValue.hour + 1 })"
            >
              +
            </fvButton>
            <div
              css-padding-y="md"
              v-text="parsedEditingValue.formattedHour"
            />
            <fvButton
              key="h-"
              css-size="sm"
              fab
              @click="setValue({ hour: parsedEditingValue.hour - 1 })"
            >
              -
            </fvButton>
          </div>
          <div> : </div>
          <div css-grow>
            <fvButton
              key="m+"
              css-size="sm"
              fab
              @click="setValue({ minute: parsedEditingValue.minute + 1 })"
            >
              +
            </fvButton>
            <div
              css-padding-y="md"
              v-text="parsedEditingValue.formattedMinute"
            />
            <fvButton
              key="m-"
              css-size="sm"
              fab
              @click="setValue({ minute: parsedEditingValue.minute - 1 })"
            >
              -
            </fvButton>
          </div>
          <div> : </div>
          <div css-grow>
            <fvButton
              key="s+"
              css-size="sm"
              fab
              @click="setValue({ second: parsedEditingValue.second + 1 })"
            >
              +
            </fvButton>
            <div
              css-padding-y="md"
              v-text="parsedEditingValue.formattedSecond"
            />
            <fvButton
              key="s-"
              css-size="sm"
              fab
              @click="setValue({ second: parsedEditingValue.second - 1 })"
            >
              -
            </fvButton>
          </div>
        </fvInputGroup>
        <div
          v-if="pick.includes('time') && currentView === 'day'"
          css-padding="sm"
          css-border-top="md"
          css-grow
          @click="currentView = 'time'"
        >
          {{ parsedEditingValue.formattedTime }}
        </div>
        <div
          v-if="pick.includes('date') && currentView === 'time'"
          css-padding="sm"
          css-border-top="md"
          css-grow
          @click="currentView = 'day'"
        >
          {{ parsedEditingValue.formattedMonthYear }}
        </div>
      </div>
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
<div v-text="val"></div>
<fvDatepicker v-model="val" placeholder="Sex" />
</example>

<script>
import color from '../mixins/color';
import size from '../mixins/size';
import formElement from '../mixins/formElement';

const createDateInstance = (dates, Constructor) => {
  let value;
  let currentIndex = 0;
  do {
    value = new Constructor(dates[currentIndex]);
    currentIndex += 1;
  } while ((!value || !value.getTime()) && dates[currentIndex]);
  return value;
};

const parseDate = (dates, Constructor) => {
  const value = createDateInstance(dates, Constructor);
  return {
    year: value.getFullYear(),
    month: value.getMonth(),
    date: value.getDate(),
    day: value.getDay(),
    hour: value.getHours(),
    minute: value.getMinutes(),
    second: value.getSeconds(),
  };
};

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
      default: () => ['date', 'time'],
      validator: (v) => v.length && v.every((i) => ['date', 'time'].includes(i)),
    },
    dateConstructor: {
      type: Function,
      default: Date,
    },
  },
  data() {
    return {
      localCurrentView: null, // day, monthyear, time
      editingValue: null,
      inputTimeTimer: null,
    };
  },
  computed: {
    views() {
      return [
        ...(this.pick.includes('date') ? ['day', 'monthyear'] : []),
        ...(this.pick.includes('time') ? ['time'] : []),
      ];
    },
    currentView: {
      set(x) {
        this.localCurrentView = x;
      },
      get() {
        return this.views.includes(this.localCurrentView) ? this.localCurrentView : this.views[0];
      },
    },
    parsedEditingValue() {
      const mainObj = parseDate([
        this.editingValue,
        this.defaultValue,
      ], this.dateConstructor);
      return {
        ...mainObj,
        formattedMonthYear: `${mainObj.year}-${mainObj.month.toString().padStart(2, 0)}`,
        formattedTime: `${mainObj.hour.toString().padStart(2, 0)}:${mainObj.minute.toString().padStart(2, 0)}:${mainObj.second.toString().padStart(2, 0)}`,
        formattedHour: mainObj.hour.toString().padStart(2, 0),
        formattedMinute: mainObj.minute.toString().padStart(2, 0),
        formattedSecond: mainObj.second.toString().padStart(2, 0),
      };
    },
    parsedValue() {
      return parseDate([this.value], this.dateConstructor);
    },
    daysMatrix() {
      if (!this.pick.includes('date')) return [];
      const ret = [];
      const { year, month } = this.parsedEditingValue;
      const monthFirstDay = this.monthFirstDay(year, month);
      const daysInMonth = this.daysInMonth(year, month);
      const daysInPrevMonth = this.daysInMonth(year, month - 1);
      for (let i = 0; i < 6; i += 1) {
        const row = [];
        const dayStart = i * 7;
        for (let j = 0; j < 7; j += 1) {
          let value = (dayStart + j) - (monthFirstDay - 1);
          let isGray = true;
          let isSelected = false;
          let monthValue = month;
          if (value < 1) {
            value += daysInPrevMonth;
            monthValue -= 1;
          } else if (value > daysInMonth) {
            value -= daysInMonth;
            monthValue += 1;
          } else {
            isGray = false;
          }
          isSelected = this.isDateSelected(year, monthValue, value);
          row.push({
            value,
            monthValue,
            isGray,
            isSelected,
          });
        }
        ret.push(row);
      }
      return ret;
    },
    monthsMatrix() {
      if (!this.pick.includes('date')) return [];
      const ret = [];
      const { month } = this.parsedEditingValue;
      for (let i = 0; i < 4; i += 1) {
        const row = [];
        const monthStart = i * 3;
        for (let j = 0; j < 3; j += 1) {
          const value = monthStart + j;
          row.push({
            value,
            isSelected: month === value,
          });
        }
        ret.push(row);
      }
      return ret;
    },
    yearsMatrix() {
      if (!this.pick.includes('date')) return [];
      const ret = [];
      const { year } = this.parsedEditingValue;
      for (let i = -8; i < 11; i += 1) {
        const row = [];
        const yearStart = (i * 3) - 3;
        for (let j = -1; j < 2; j += 1) {
          const value = (yearStart + j) + year;
          row.push({
            value,
            isSelected: year === value,
          });
        }
        ret.push(row);
      }
      return ret;
    },
  },
  watch: {
    value() {
      this.resetEditingValue();
    },
  },
  methods: {
    resetEditingValue() {
      this.editingValue = createDateInstance([this.value, this.defaultValue], this.dateConstructor);
    },
    handleBoxOpen() {
      this.resetEditingValue();
    },
    monthFirstDay(year, month) {
      // eslint-disable-next-line new-cap
      return new this.dateConstructor(year, month, 1).getDay();
    },
    daysInMonth(year, month) {
      // eslint-disable-next-line new-cap
      return new this.dateConstructor(year, month + 1, 0).getDate();
    },
    setValue({
      year = null,
      month = null,
      date = null,
      hour = null,
      minute = null,
      second = null,
    }, scope = 'value') {
      const newDate = createDateInstance([
        this[scope],
        this.defaultValue,
      ], this.dateConstructor);
      if (year !== null) newDate.setFullYear(year);
      if (month !== null) newDate.setMonth(month);
      if (date !== null) newDate.setDate(date);
      if (hour !== null) newDate.setHours(hour);
      if (minute !== null) newDate.setMinutes(minute);
      if (second !== null) newDate.setSeconds(second);
      if (scope === 'value') {
        this.$emit('input', newDate);
      } else {
        this.editingValue = newDate;
      }
    },
    isDateSelected(uYear, uMonth, uDate) {
      const { year, month, date } = this.parsedValue;
      // eslint-disable-next-line new-cap
      const { year: cYear, month: cMonth, date: cDate } = parseDate([new this.dateConstructor(uYear, uMonth, uDate)], this.dateConstructor);
      return year === cYear && month === cMonth && date === cDate;
    },
    handleKeydown(_event) {
      // eslint-disable-next-line no-console
      console.log('not implemented yet', _event);
    },
    clearValue() {
      this.$emit('input', undefined);
    },
  },
  style({ className }) {
    const $daySize = this.$theme.sizes.base.factor(this.$size, 'custom', {
      factors: [0, 1, 3, 4, 5, 6],
    });
    return [
      className('box', {
        width: `${parseInt($daySize, 10) * 7}px`,
        textAlign: 'center',
      }),
      className('dateTable', {
        width: '100%',
        '&.month td': {
          width: '33.33%',
        },
        '&.day td': {
          width: $daySize,
        },
        '& td': {
          height: $daySize,
          verticalAlign: 'middle',
          '&.gray': {
            opacity: 0.4,
          },
          '&.selected': {
            background: this.$theme.colors.primary.normal,
            color: this.$theme.colors.primary.text,
            borderRadius: this.$theme.sizes.radius.normal,
          },
        },
      }),
    ];
  },
};
</script>
