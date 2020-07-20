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
                  @click="yearWheel.prev"
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
                  @click="yearWheel.next"
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
                @click="timeWheel.next"
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
                @click="timeWheel.prev"
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
  let value = null;
  let currentIndex = 0;
  do {
    value = new Constructor(dates[currentIndex]);
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
    daysGrid() {
      if (!this.pick.includes('date')) return [];
      const { year, month } = this.parsedEditingValue;
      const monthFirstDay = this.monthFirstDay(year, month);
      const daysInMonth = this.daysInMonth(year, month);
      const daysInPrevMonth = this.daysInMonth(year, month - 1);
      const ret = [];
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
            key: `day${(i * 7) + j}`,
            value,
            isGray,
            isSelected,
            click: () => this.setValue({ date: value, month: monthValue }),
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
      const { year, month } = this.parsedEditingValue;
      return {
        key: 'monthYearLink',
        click: () => this.changeView('monthYear'),
        down: () => this.changeHighlight(this.daysGrid[0][3]),
        up: () => this.changeHighlight(this.timeLink || this.daysGrid[5][3]),
        value: `${year}/${(month + 1).toString().padStart(2, 0)}`,
      };
    },
    timeLink() {
      if (this.pick.includes('time')) {
        return {
          key: 'timelink',
          click: () => this.changeView('time'),
          down: () => this.changeHighlight(this.monthYearLink),
          up: () => this.changeHighlight(this.daysGrid[5][3]),
          value: this.parsedValue ? `${this.timeWheels.map((part) => part.value).join(':')}` : '--:--:--',
        };
      }
      return null;
    },
    monthsGrid() {
      if (!this.pick.includes('date')) return [];
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
      if (this.pick.includes('date')) {
        return {
          key: 'daylink',
          value: this.parsedValue ? `${this.parsedValue.year}/${(this.parsedValue.month + 1).toString().padStart(2, 0)}/${this.parsedValue.date.toString().padStart(2, 0)}` : '----/--/--',
          click: () => this.changeView('day'),
          next: () => this.changeHighlight(this.timeWheels[0]),
          prev: () => this.changeHighlight(this.timeWheels[2]),
        };
      }
      return null;
    },
    timeWheels() {
      return ['hour', 'minute', 'second'].map((val, index) => ({
        key: `time${index}`,
        value: this.parsedEditingValue[val].toString().padStart(2, 0),
        up: () => this.setValue({ [val]: this.parsedEditingValue[val] + 1 }, 'editingValue'),
        down: () => this.setValue({ [val]: this.parsedEditingValue[val] - 1 }, 'editingValue'),
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
        class: { highlighted: this.highlighted.key === value.key, selected: value.isSelected, gray: value.isGray },
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
        ['day', this.monthYearLink],
        ['monthYear', this.monthsGrid[0][0]],
        ['time', this.timeWheels[0]],
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
          '&.selected': {
            background: this.$theme.colors.primary.normal,
            color: this.$theme.colors.primary.text,
          },
        },
      }),
    ];
  },
};
</script>
