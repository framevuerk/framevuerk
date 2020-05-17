<template>
  <div :class="$style.pagination">
    <span class="page">
      <fvButton
        v-if="navigation"
        :disabled="value === 1 || !prev"
        @click="$emit('input', value - 1)"
      >
        <div
          class="icon"
          v-text="$theme.direction.prevChar"
        />
      </fvButton>
    </span>
    <span
      v-for="page in pages()"
      :key="page.key"
      class="page"
    >
      <b
        v-if="page.type === 'dots'"
        class="other"
      >
        &mldr;
      </b>
      <fvButton
        v-else-if="page.number !== value"
        @click="$emit('input', page.number)"
      >
        {{ page.text || page.number }}
      </fvButton>
      <fvButton
        v-else-if="!inputMode"
        css-color="primary"
        @click="turnInputMode"
      >
        {{ page.number }}
      </fvButton>
      <fvInput
        v-else
        ref="input"
        class="input"
        :value="page.number.toString()"
        type="number"
        :min="1"
        :max="total || undefined"
        @blur.native="inputMode = false"
        @keyup.native.enter="onEnterPage"
      />
    </span>
    <span class="page">
      <fvButton
        v-if="navigation"
        :disabled="value === total || !next"
        @click="$emit('input', value + 1)"
      >
        <div
          class="icon"
          v-text="$theme.direction.nextChar"
        />
      </fvButton>
    </span>
  </div>
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
@config title 'With Total Count'
@config state true
@config example true

@data val = undefined
<fvPagination v-model="val" :total="10" />
</example>

<example>
@config title 'Without Total Count'
@config state true
@config example true

@data val = undefined
@data next = true

<fvButton @click="next = !next"> Next = {{next}} (click to toggle) </fvButton>
<fvPagination v-model="val" :next="next" />
</example>

<script>
export default {
  inject: ['$theme'],
  props: {
    value: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 0,
    },
    size: {
      type: Number,
      default: 5,
    },
    navigation: {
      type: Boolean,
      default: true,
    },
    next: {
      type: Boolean,
      default: true,
    },
    prev: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      inputMode: false,
      uniqueKey: 1,
    };
  },
  methods: {
    pages() {
      const key = () => `${Math.random()}${Date.now()}`;
      const numberObj = (number) => ({
        type: 'page',
        key: key(),
        number,
      });
      const dotsObj = () => ({
        type: 'dots',
        key: key(),
      });
      const ret = [];
      if (this.total > 0 && this.size >= this.total) {
        // return full set if size is enaugh for all
        for (let i = 0; i < this.total; i += 1) {
          ret.push(numberObj(i + 1));
        }
        return ret;
      }

      if (this.total < 1) {
        const size = this.size - 1;
        let counter = (this.value - size) + 1;
        if (counter < 2) counter = 2;
        if (this.value > 1 || this.next) ret.push(numberObj(1));
        if (counter > 2) ret.push(dotsObj());
        for (let i = 0; i < size; i += 1) {
          if (counter > 1 && counter <= this.value) ret.push(numberObj(counter));
          counter += 1;
        }
        if (this.next) ret.push(dotsObj());
        return ret;
      }
      const size = this.size - 2;
      let counter = this.value - Math.floor(size / 2);
      if (this.value > 0) ret.push(numberObj(1));
      if (counter + size >= this.total) counter -= (counter + size) - this.total;
      if (counter < 2) counter = 2;
      if (counter > 2) ret.push(dotsObj());
      for (let i = 0; i < size; i += 1) {
        ret.push(numberObj(counter));
        counter += 1;
      }
      if (counter < this.total) ret.push(dotsObj());
      ret.push(numberObj(this.total));
      return ret;
    },
    turnInputMode() {
      this.inputMode = true;
      this.$nextTick(() => {
        this.$refs.input[0].focus();
      });
    },
    onEnterPage(event) {
      const newPage = parseInt(event.target.value, 10);
      this.inputMode = false;
      if (newPage > 0 && newPage <= this.total) {
        this.$emit('input', newPage);
      }
    },
  },
  style({ className }) {
    const paddingSm = this.$theme.sizes.base.factor('sm', 'size');
    return [
      className('pagination', {
        '& > *:not(:first-child)': {
          [`margin-${this.$theme.direction.start}`]: paddingSm,
        },
        '& .page': {
          '& > .input': {
            width: '6em',
            textAlign: 'center',
          },
          '& > .other': {
            padding: paddingSm,
          },
        },
      }),
    ];
  },
};
</script>
