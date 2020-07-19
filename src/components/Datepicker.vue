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
        <div v-if="currentView === 'day'">
          <div
            css-flex
            css-padding="sm"
            css-border-bottom="md"
            css-cursor="pointer"
            :class="[navigateParts.monthyear.isHighlighted && 'highlighted']"
            @click="navigateParts.monthyear.click"
            @mousemove="currentHighlighted = navigateParts.monthyear.highlightKey"
            v-text="navigateParts.monthyear.value"
          />
          <table
            :class="$style.dateTable"
            class="day"
            css-padding="sm"
          >
            <tbody>
              <tr
                v-for="(daysRow, i) in daysParts"
                :key="'days-tr-'+i"
              >
                <td
                  v-for="(day, j) in daysRow"
                  :key="'days-td-'+j"
                  :class="[day.isGray && 'gray', day.isSelected && 'selected', day.isHighlighted && 'highlighted']"
                  @mousemove="currentHighlighted = day.highlightKey"
                  @click="day.click"
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
                v-for="(monthsRow, i) in monthsParts"
                :key="'months-tr-'+i"
              >
                <td
                  v-for="(month, j) in monthsRow"
                  :key="'months-td-'+j"
                  :class="[month.isSelected && 'selected', month.isHighlighted && 'highlighted']"
                  @mousemove="currentHighlighted = month.highlightKey"
                  @click="month.click"
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
            :class="[yearPart.isHighlighted && 'highlighted']"
            @mousemove.native="currentHighlighted = yearPart.highlightKey"
          >
            <div>
              <fvButton
                tabindex="-1"
                fab
                css-size="sm"
                @click="yearPart.prev"
              >
                -
              </fvButton>
            </div>
            <div
              css-grow
              v-text="yearPart.value"
            />
            <div>
              <fvButton
                tabindex="-1"
                fab
                css-size="sm"
                @click="yearPart.next"
              >
                +
              </fvButton>
            </div>
          </fvInputGroup>
        </div>
        <fvInputGroup
          v-if="currentView === 'time'"
          css-flex
        >
          <div
            v-for="timePart in timeParts"
            :key="timePart.highlightKey"
            :class="[timePart.isHighlighted && 'highlighted']"
            css-grow
            css-padding="md"
            @mousemove="currentHighlighted = timePart.highlightKey"
          >
            <fvButton
              tabindex="-1"
              css-size="sm"
              fab
              @click="timePart.next"
            >
              +
            </fvButton>
            <div
              css-padding-y="md"
              v-text="timePart.value"
            />
            <fvButton
              tabindex="-1"
              css-size="sm"
              fab
              @click="timePart.prev"
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
          css-cursor="pointer"
          :class="[navigateParts.time.isHighlighted && 'highlighted']"
          @click="navigateParts.time.click"
          @mousemove="currentHighlighted = navigateParts.time.highlightKey"
          v-text="navigateParts.time.value"
        />
        <div
          v-if="pick.includes('date') && currentView === 'time'"
          css-padding="sm"
          css-border-top="md"
          css-grow
          css-cursor="pointer"
          :class="[navigateParts.day.isHighlighted && 'highlighted']"
          @click="navigateParts.day.click"
          @mousemove="currentHighlighted = navigateParts.day.highlightKey"
          v-text="navigateParts.day.value"
        />
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
      currentView: null, // day, monthyear, time
      editingValue: null,
      inputTimeTimer: null,
      currentHighlighted: 'day-1', // 'day-0 to day-41, month-0 to month-11, time-0 to time-2, monthyear, day, time
    };
  },
  computed: {
    views() {
      return [
        ...(this.pick.includes('date') ? ['day', 'monthyear'] : []),
        ...(this.pick.includes('time') ? ['time'] : []),
      ];
    },
    parsedEditingValue() {
      const mainObj = parseDate([
        this.editingValue,
        this.defaultValue,
      ], this.dateConstructor);
      return {
        ...mainObj,
        formattedFullDate: `${mainObj.year}/${mainObj.month.toString().padStart(2, 0)}/${mainObj.date.toString().padStart(2, 0)}`,
        formattedMonthYear: `${mainObj.year}/${mainObj.month.toString().padStart(2, 0)}`,
        formattedTime: `${mainObj.hour.toString().padStart(2, 0)}:${mainObj.minute.toString().padStart(2, 0)}:${mainObj.second.toString().padStart(2, 0)}`,
        formattedHour: mainObj.hour.toString().padStart(2, 0),
        formattedMinute: mainObj.minute.toString().padStart(2, 0),
        formattedSecond: mainObj.second.toString().padStart(2, 0),
      };
    },
    parsedValue() {
      return parseDate([this.value], this.dateConstructor);
    },
    daysParts() {
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
          const highlightKey = `day-${(i * 7) + j}`;
          row.push({
            value,
            monthValue,
            isGray,
            isSelected,
            highlightKey,
            isHighlighted: this.currentHighlighted === highlightKey,
            click: () => this.setValue({ date: value, month: monthValue }),
          });
        }
        ret.push(row);
      }
      return ret;
    },
    monthsParts() {
      if (!this.pick.includes('date')) return [];
      const ret = [];
      const { month } = this.parsedEditingValue;
      for (let i = 0; i < 4; i += 1) {
        const row = [];
        const monthStart = i * 3;
        for (let j = 0; j < 3; j += 1) {
          const value = monthStart + j;
          const highlightKey = `monthyear-${(i * 3) + j}`;
          row.push({
            value,
            isSelected: month === value,
            highlightKey,
            isHighlighted: this.currentHighlighted === highlightKey,
            click: () => {
              this.setValue({ month: value }, 'editingValue');
              this.changeView('day');
            },
          });
        }
        ret.push(row);
      }
      return ret;
    },
    yearPart() {
      const { year } = this.parsedEditingValue;
      const highlightKey = 'year';
      return {
        highlightKey,
        isHighlighted: this.currentHighlighted === highlightKey,
        value: year,
        next: () => this.setValue({ year: year + 1 }, 'editingValue'),
        prev: () => this.setValue({ year: year - 1 }, 'editingValue'),
      };
    },
    timeParts() {
      const { hour, minute, second } = this.parsedEditingValue;
      return [[hour, 'hour'], [minute, 'minute'], [second, 'second']].map((val, index) => {
        const highlightKey = `time-${index}`;
        return {
          highlightKey,
          isHighlighted: this.currentHighlighted === highlightKey,
          value: val[0].toString().padStart(2, 0),
          next: () => this.setValue({ [val[1]]: val[0] + 1 }, 'editingValue'),
          prev: () => this.setValue({ [val[1]]: val[0] - 1 }, 'editingValue'),
        };
      });
    },
    navigateParts() {
      return {
        monthyear: {
          highlightKey: 'monthyear',
          isHighlighted: this.currentHighlighted === 'monthyear',
          click: () => this.changeView('monthyear'),
          value: `${this.parsedEditingValue.year}/${(this.parsedEditingValue.month + 1).toString().padStart(2, 0)}`,
        },
        time: {
          highlightKey: 'time',
          isHighlighted: this.currentHighlighted === 'time',
          click: () => this.changeView('time'),
          value: this.parsedValue ? `${this.timeParts.map((part) => part.value).join(':')}` : '--:--:--',
        },
        day: {
          highlightKey: 'day',
          isHighlighted: this.currentHighlighted === 'day',
          click: () => this.changeView('day'),
          value: this.parsedValue ? `${this.parsedValue.year}/${(this.parsedValue.month + 1).toString().padStart(2, 0)}/${this.parsedValue.date.toString().padStart(2, 0)}` : '----/--/--',
        },
      };
    },
  },
  watch: {
    value() {
      this.resetEditingValue();
    },
  },
  methods: {
    changeView(userValue) {
      const value = this.views.includes(userValue) ? userValue : this.views[0];
      this.currentView = value;
      this.currentHighlighted = `${value}-0`;
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
      const { currentHighlighted, currentView } = this;
      const [currentHighlightedPart, currentHighlightedIndex] = currentHighlighted.split('-');
      const numberedCurrentHighlightedIndex = Number(currentHighlightedIndex);
      const { endKey, startKey } = this.$theme.direction;
      console.log(keyCode);
      if (currentView === 'day') {
        switch (keyCode) {
          case 38:
            if (currentHighlighted === 'monthyear') {
              this.currentHighlighted = 'time';
            } else if (currentHighlighted === 'time') {
              this.currentHighlighted = 'day-38';
            } else if (Math.floor(numberedCurrentHighlightedIndex / 7) === 0) {
              this.currentHighlighted = 'monthyear';
            } else {
              this.currentHighlighted = `day-${numberedCurrentHighlightedIndex - 7}`;
            }
            event.preventDefault();
            break;
          case 40:
            if (currentHighlighted === 'monthyear') {
              this.currentHighlighted = 'day-3';
            } else if (currentHighlighted === 'time') {
              this.currentHighlighted = 'monthyear';
            } else if (Math.floor(numberedCurrentHighlightedIndex / 7) === 5) {
              this.currentHighlighted = 'time';
            } else {
              this.currentHighlighted = `day-${numberedCurrentHighlightedIndex + 7}`;
            }
            event.preventDefault();
            break;
          case startKey:
            if (!Number.isNaN(numberedCurrentHighlightedIndex)) {
              const rowIndex = Math.floor(numberedCurrentHighlightedIndex / 7);
              const colIndex = numberedCurrentHighlightedIndex % 7;
              this.currentHighlighted = `day-${(rowIndex * 7) + (colIndex === 0 ? 6 : colIndex - 1)}`;
            }
            event.preventDefault();
            break;
          case endKey:
            if (!Number.isNaN(numberedCurrentHighlightedIndex)) {
              const rowIndex = Math.floor(numberedCurrentHighlightedIndex / 7);
              const colIndex = numberedCurrentHighlightedIndex % 7;
              this.currentHighlighted = `day-${(rowIndex * 7) + (colIndex === 6 ? 0 : colIndex + 1)}`;
            }
            event.preventDefault();
            break;
          case 13:
            if (!Number.isNaN(numberedCurrentHighlightedIndex)) {
              this.daysParts[Math.floor(numberedCurrentHighlightedIndex / 7)][numberedCurrentHighlightedIndex % 7].click();
            } else {
              this.navigateParts[currentHighlightedPart].click();
            }
            event.preventDefault();
            break;
          default:
        }
      } else if (currentView === 'monthyear') {
        switch (keyCode) {
          case 38:
            if (currentHighlighted === 'year') {
              this.currentHighlighted = 'monthyear-10';
            } else if (Math.floor(numberedCurrentHighlightedIndex / 3) === 0) {
              this.currentHighlighted = 'year';
            } else {
              this.currentHighlighted = `monthyear-${numberedCurrentHighlightedIndex - 3}`;
            }
            event.preventDefault();
            break;
          case 40:
            if (currentHighlighted === 'year') {
              this.currentHighlighted = 'monthyear-1';
            } else if (Math.floor(numberedCurrentHighlightedIndex / 3) === 3) {
              this.currentHighlighted = 'year';
            } else {
              this.currentHighlighted = `monthyear-${numberedCurrentHighlightedIndex + 3}`;
            }
            event.preventDefault();
            break;
          case startKey:
            if (!Number.isNaN(numberedCurrentHighlightedIndex)) {
              const rowIndex = Math.floor(numberedCurrentHighlightedIndex / 3);
              const colIndex = numberedCurrentHighlightedIndex % 3;
              this.currentHighlighted = `monthyear-${(rowIndex * 3) + (colIndex === 0 ? 2 : colIndex - 1)}`;
            } else {
              this.yearPart.prev();
            }
            event.preventDefault();
            break;
          case endKey:
            if (!Number.isNaN(numberedCurrentHighlightedIndex)) {
              const rowIndex = Math.floor(numberedCurrentHighlightedIndex / 3);
              const colIndex = numberedCurrentHighlightedIndex % 3;
              this.currentHighlighted = `monthyear-${(rowIndex * 3) + (colIndex === 2 ? 0 : colIndex + 1)}`;
            } else {
              this.yearPart.next();
            }
            event.preventDefault();
            break;
          case 13:
            if (!Number.isNaN(numberedCurrentHighlightedIndex)) {
              this.monthsParts[Math.floor(numberedCurrentHighlightedIndex / 3)][numberedCurrentHighlightedIndex % 3].click();
            }
            event.preventDefault();
            break;
          default:
        }
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
