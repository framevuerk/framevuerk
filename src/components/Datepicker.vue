<template>
  <fvInputBox
    ref="inputBox"
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
      v-if="displayValue"
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
        <span v-text="displayValue" />
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
        <div v-if="view === 'day'">
          <div
            css-padding="sm"
            css-border-bottom="md"
            v-bind="highlightableProps(monthYearLink)"
            v-on="highlightableEvents(monthYearLink)"
            v-text="monthYearLink.value"
          />
          <table
            :class="$style.dateTable"
            class="day"
            css-padding="sm"
          >
            <tbody>
              <tr
                v-for="(daysRow, i) in daysGrid"
                :key="i"
              >
                <td
                  v-for="day in daysRow"
                  :key="day.key"
                  v-bind="highlightableProps(day)"
                  v-on="highlightableEvents(day)"
                  v-text="day.value"
                />
              </tr>
            </tbody>
          </table>
          <div
            v-if="timeLink"
            css-padding="sm"
            css-border-top="md"
            v-bind="highlightableProps(timeLink)"
            v-on="highlightableEvents(timeLink)"
            v-text="timeLink.value"
          />
        </div>
        <div
          v-if="view === 'monthYear'"
        >
          <table
            :class="$style.dateTable"
            class="month"
            css-padding="sm"
          >
            <tbody>
              <tr
                v-for="(monthsRow, i) in monthsGrid"
                :key="i"
              >
                <td
                  v-for="month in monthsRow"
                  :key="month.key"
                  v-bind="highlightableProps(month)"
                  v-on="highlightableEvents(month)"
                  v-text="month.value"
                />
              </tr>
            </tbody>
          </table>
          <div
            v-bind="highlightableProps(yearWheel)"
            v-on="highlightableEvents(yearWheel)"
          >
            <fvInputGroup
              css-flex
              css-border-top="md"
              css-padding="sm"
            >
              <div>
                <fvButton
                  tabindex="-1"
                  fab
                  css-size="sm"
                  @click.prevent="yearWheel.prev"
                >
                  -
                </fvButton>
              </div>
              <div
                css-grow
                v-text="yearWheel.value"
              />
              <div>
                <fvButton
                  tabindex="-1"
                  fab
                  css-size="sm"
                  @click.prevent="yearWheel.next"
                >
                  +
                </fvButton>
              </div>
            </fvInputGroup>
          </div>
        </div>
        <div
          v-if="view === 'time'"
        >
          <fvInputGroup
            css-flex
          >
            <div
              v-for="timeWheel in timeWheels"
              :key="timeWheel.key"
              css-grow
              css-padding="md"
              v-bind="highlightableProps(timeWheel)"
              v-on="highlightableEvents(timeWheel)"
            >
              <fvButton
                tabindex="-1"
                css-size="sm"
                fab
                @click.prevent="timeWheel.up"
              >
                +
              </fvButton>
              <div
                css-padding-y="md"
                v-text="timeWheel.value"
              />
              <fvButton
                tabindex="-1"
                css-size="sm"
                fab
                @click.prevent="timeWheel.down"
              >
                -
              </fvButton>
            </div>
          </fvInputGroup>
          <div
            v-if="dayLink"
            css-padding="sm"
            css-border-top="md"
            v-bind="highlightableProps(dayLink)"
            v-on="highlightableEvents(dayLink)"
            v-text="dayLink.value"
          />
        </div>
      </div>
    </template>
  </fvInputBox>
</template>

<doc>
@prop value @type Any value that js Date constructor accept @default undefined @description Value of input.
@prop defaultValue @type Any value that js Date constructor accept @default Local Time (Date.now()) @description Default highlighted date when box open.
@prop pick @type oneOf(['date'], ['time'], ['date', 'time']) @default ['date'] @description Datepicker box views.
@prop dateConstructor @type Any contructor that has native js methods and act like it. @default Date @description Datepicker Date constructor.

@prop disabled @type Boolean @default false @description Is disabled?
@prop required @type Boolean @default false @description Is required to fill?
@prop validation @type Function @default () => true @description If you use this element inside `form` component, the `form` component will reject until this function pass `true` or empty array. You can return Array of errors or even Boolean value at the end of function.
@prop formatter @type Function @default (value) => value @description If you use this element inside `form` component, will format `value` of component by this function.
@prop name @type String @default () => Math.random() @description If you use this element inside `form` component, you will access the value and triggered errors of this component by this key.
@prop placeholder @type String @default '' @description Showes when value is empty.
@prop cssColor @type String @default 'background' @description Use any colors that already declared in themeProvider.
@prop cssSize @type oneOf('xs', 'sm', 'md', 'lg', 'xl') @default 'md' @description Size of element.

@event input @params newValue @description Triggers when value changes within component.
</doc>

<example>
@config title 'Default (just Date)'
@config state true
@config example true

@data val = undefined
<fvDatepicker v-model="val" placeholder="Choose Date" />
</example>

<example>
@config title 'Date and Time'
@config state true
@config example true

@data val = undefined
<fvDatepicker v-model="val" :pick="['date', 'time']" placeholder="Select Date and Time" />
</example>

<example>
@config title 'Time'
@config state true
@config example true

@data val = undefined
<fvDatepicker v-model="val" :pick="['time']" placeholder="Select Time" />
</example>

<example>
@config title 'Custom Validation'
@config state true
@config example true

@data val = undefined
@data validation = (val) => { if (val && val.getDate() % 2 === 0) return true; else return false; }
<fvDatepicker v-model="val" placeholder="Select Date and Time" :validation="validation" />
</example>

<example>
@config title 'Custom Date Constructor (Jalaali Date using <a css-text-color="primary" href="https://github.com/nainemom/idate" target="_blank"> IDate library </a>)'
@config state true
@config example true

@data val = undefined
@data IDate = require('idate')
<fvDatepicker v-model="val" :pick="['date', 'time']" placeholder="Choose Jalaali Date" :date-constructor="IDate" />
</example>

<script>
import color from '../mixins/color';
import size from '../mixins/size';
import formElement from '../mixins/formElement';

const createDateInstance = (dates, Constructor) => {
  let value = null;
  let currentIndex = 0;
  do {
    value = dates[currentIndex] ? new Constructor(dates[currentIndex]) : { getTime: () => 0 };
    if (!value.getTime()) {
      value = null;
    }
    currentIndex += 1;
  } while (!value && dates[currentIndex]);
  return value;
};

const parseDate = (dates, Constructor) => {
  const value = createDateInstance(dates, Constructor);
  if (!value) return null;
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

const padByZero = (val, length = 2) => val.toString().padStart(length, 0);

export default {
  mixins: [
    color,
    size,
    formElement,
  ],
  inject: ['$theme'],
  props: {
    value: {
      default: undefined,
      validator: (v) => {
        try {
          return !v || v.getTime();
        } catch {
          return (new Date(v).getTime());
        }
      },
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
      default: () => Date,
      validator: (Constructor) => new Constructor().getTime(),
    },
  },
  data() {
    return {
      editingValue: null,
      view: null,
      highlighted: null,
    };
  },
  computed: {
    views() {
      return [
        ...(this.pick.includes('date') ? ['day', 'monthYear'] : []),
        ...(this.pick.includes('time') ? ['time'] : []),
      ];
    },
    parsedEditingValue() {
      return parseDate([
        this.editingValue,
        this.defaultValue,
      ], this.dateConstructor);
    },
    parsedValue() {
      return parseDate([this.value], this.dateConstructor);
    },
    displayValue() {
      if (!this.parsedValue) return '';
      const {
        year,
        month,
        date,
        hour,
        minute,
        second,
      } = this.parsedValue;
      const ret = [];
      if (this.pick.includes('date')) {
        ret.push(`${year}/${padByZero(month + 1)}/${padByZero(date)}`);
      }
      if (this.pick.includes('time')) {
        ret.push(`${padByZero(hour)}:${padByZero(minute)}:${padByZero(second)}`);
      }
      return ret.join(' ');
    },
    daysGrid() {
      if (!this.pick.includes('date')) return null;
      const { year, month } = this.parsedEditingValue;
      const monthFirstDay = this.monthFirstDay(year, month);
      const daysInMonth = this.daysInMonth(year, month);
      const daysInPrevMonth = this.daysInMonth(year, month - 1);
      const ret = [];
      const today = parseDate([Date.now()], this.dateConstructor);
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
          const isDisabled = !this.validation(this.setValue({ date: value, month: monthValue }, 'temp'));
          row.push({
            key: `day${(i * 7) + j}`,
            value,
            isGray,
            isDisabled,
            isSelected,
            isToday: today.date === value && today.month === monthValue,
            click: () => {
              if (isDisabled) return false;
              this.setValue({ date: value, month: monthValue });
              return this.$nextTick(() => {
                if (!this.pick.includes('time')) {
                  this.$refs.inputBox.isOpened = false;
                } else {
                  this.changeView('time');
                }
              });
            },
            up: () => this.changeHighlight(i === 0 ? this.monthYearLink : this.daysGrid[i - 1][j]),
            down: () => this.changeHighlight(i === 5 ? this.timeLink || this.daysGrid[0][j] : this.daysGrid[i + 1][j]),
            next: () => this.changeHighlight(this.daysGrid[i][j === 6 ? 0 : j + 1]),
            prev: () => this.changeHighlight(this.daysGrid[i][j === 0 ? 6 : j - 1]),
          });
        }
        ret.push(row);
      }
      return ret;
    },
    monthYearLink() {
      if (!this.pick.includes('date')) return null;
      const { year, month } = this.parsedEditingValue;
      return {
        key: 'monthYearLink',
        click: () => this.changeView('monthYear'),
        down: () => this.changeHighlight(this.daysGrid[0][3]),
        up: () => this.changeHighlight(this.timeLink || this.daysGrid[5][3]),
        value: `${year}/${padByZero(month + 1)}`,
      };
    },
    timeLink() {
      if (!this.pick.includes('time')) return null;
      return {
        key: 'timelink',
        click: () => this.changeView('time'),
        down: () => this.changeHighlight(this.monthYearLink),
        up: () => this.changeHighlight(this.daysGrid[5][3]),
        value: this.parsedValue ? `${this.timeWheels.map((part) => part.value).join(':')}` : '--:--:--',
      };
    },
    monthsGrid() {
      if (!this.pick.includes('date')) return null;
      const ret = [];
      const { month } = this.parsedEditingValue;
      for (let i = 0; i < 4; i += 1) {
        const row = [];
        const monthStart = i * 3;
        for (let j = 0; j < 3; j += 1) {
          const value = monthStart + j;
          row.push({
            key: `month-${value}`,
            value: value + 1,
            isSelected: month === value,
            click: () => {
              this.setValue({ month: value }, 'editingValue');
              this.changeView('day');
            },
            up: () => this.changeHighlight(i === 0 ? this.yearWheel : this.monthsGrid[i - 1][j]),
            down: () => this.changeHighlight(i === 3 ? this.yearWheel : this.monthsGrid[i + 1][j]),
            next: () => this.changeHighlight(this.monthsGrid[i][j === 2 ? 0 : j + 1]),
            prev: () => this.changeHighlight(this.monthsGrid[i][j === 0 ? 2 : j - 1]),
          });
        }
        ret.push(row);
      }
      return ret;
    },
    yearWheel() {
      if (!this.pick.includes('date')) return null;
      return {
        key: 'yearWheel',
        value: this.parsedEditingValue.year,
        up: () => this.changeHighlight(this.monthsGrid[3][1]),
        down: () => this.changeHighlight(this.monthsGrid[0][1]),
        next: () => this.setValue({ year: this.parsedEditingValue.year + 1 }, 'editingValue'),
        prev: () => this.setValue({ year: this.parsedEditingValue.year - 1 }, 'editingValue'),
      };
    },
    dayLink() {
      if (!this.pick.includes('date')) return null;
      return {
        key: 'daylink',
        value: this.parsedValue ? `${this.parsedValue.year}/${padByZero(this.parsedValue.month + 1)}/${padByZero(this.parsedValue.date)}` : '----/--/--',
        click: () => this.changeView('day'),
        next: () => this.changeHighlight(this.timeWheels[0]),
        prev: () => this.changeHighlight(this.timeWheels[2]),
      };
    },
    timeWheels() {
      if (!this.pick.includes('time')) return null;
      return ['hour', 'minute', 'second'].map((val, index) => ({
        key: `time${index}`,
        value: padByZero(this.parsedEditingValue[val]),
        up: () => this.setValue({ [val]: this.parsedEditingValue[val] + 1 }),
        down: () => this.setValue({ [val]: this.parsedEditingValue[val] - 1 }),
        next: () => this.changeHighlight(index === 2 ? this.dayLink || this.timeWheels[0] : this.timeWheels[index + 1]),
        prev: () => this.changeHighlight(index === 0 ? this.dayLink || this.timeWheels[2] : this.timeWheels[index - 1]),
      }));
    },
  },
  watch: {
    value() {
      this.resetEditingValue();
    },
  },
  methods: {
    highlightableProps(value) {
      return {
        class: {
          highlighted: this.highlighted.key === value.key,
          selected: value.isSelected,
          gray: value.isGray,
          disabled: value.isDisabled,
          today: value.isToday,
        },
      };
    },
    highlightableEvents(value) {
      return {
        mousemove: () => this.changeHighlight(value),
        click: () => value.click && value.click(),
      };
    },
    changeHighlight(val) {
      this.highlighted = val;
    },
    changeView(userValue) {
      const value = this.views.includes(userValue) ? userValue : this.views[0];
      const mapViewToHighlight = new Map([
        ['day', this.monthYearLink || null],
        ['monthYear', this.monthsGrid ? this.monthsGrid[0][0] : null],
        ['time', this.timeWheels ? this.timeWheels[0] : null],
      ]);
      this.view = value;
      this.changeHighlight(mapViewToHighlight.get(value));
    },
    resetEditingValue() {
      this.editingValue = createDateInstance([this.value, this.defaultValue], this.dateConstructor);
    },
    handleBoxOpen() {
      this.resetEditingValue();
      this.changeView(this.views[0]);
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
        this[scope === 'value' ? 'value' : 'editingValue'],
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
      } else if (scope === 'editingValue') {
        this.editingValue = newDate;
      } else {
        return newDate;
      }
      return true;
    },
    isDateToday(uYear, uMonth, uDate) {
      if (!this.parsedValue) return false;
      const { year, month, date } = this.parsedValue;
      // eslint-disable-next-line new-cap
      const { year: cYear, month: cMonth, date: cDate } = parseDate([new this.dateConstructor(uYear, uMonth, uDate)], this.dateConstructor);
      return year === cYear && month === cMonth && date === cDate;
    },
    isDateSelected(uYear, uMonth, uDate) {
      if (!this.parsedValue) return false;
      const { year, month, date } = this.parsedValue;
      // eslint-disable-next-line new-cap
      const { year: cYear, month: cMonth, date: cDate } = parseDate([new this.dateConstructor(uYear, uMonth, uDate)], this.dateConstructor);
      return year === cYear && month === cMonth && date === cDate;
    },
    handleKeydown(event) {
      const { keyCode } = event;
      const { endKey, startKey } = this.$theme.direction;
      if ([38, 40, endKey, startKey, 13].includes(keyCode)) event.preventDefault();
      const mapKeyToMethods = new Map([
        [38, 'up'],
        [40, 'down'],
        [endKey, 'next'],
        [startKey, 'prev'],
        [13, 'click'],
      ]);
      const action = mapKeyToMethods.get(keyCode);
      if (this.highlighted && this.highlighted[action]) {
        this.highlighted[action]();
        event.preventDefault();
      }
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
        '& .highlighted': {
          background: this.$theme.colors.background.autoShade(10),
          '&.selected': {
            background: this.$theme.colors.primary.autoShade(10),
          },
        },
        '& .disabled': {
          textDecoration: 'line-through',
        },
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
          borderRadius: this.$theme.sizes.radius.normal,
          cursor: 'pointer',
          '&.gray': {
            opacity: 0.4,
          },
          '&.today': {
            textDecoration: 'underline',
          },
          '&.selected': {
            background: this.$theme.colors.primary.normal,
            color: this.$theme.colors.primary.text,
            fontWeight: 'bold',
          },
        },
      }),
    ];
  },
};
</script>
