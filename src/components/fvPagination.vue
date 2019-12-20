<template lang="pug">
.fv-pagination
  span.page
    fv-button(v-if="navigation",
      :disabled="value === 1 || !prev",
      @click="$emit('input', value - 1)")
      .icon(:style="{ transform: icons.prev }", v-html="icons.icon")
  span.page(v-for="page in pages")
    b.other(v-if="page.type === 'dots'") …
    fv-button(v-else-if="page.number !== value",
      @click="$emit('input', page.number)") {{page.text || page.number}}
    fv-button.fv-primary(v-else-if="!inputMode",
      @click="turnInputMode") {{page.number}}
    fv-input.input(v-else,
      ref="input",
      :value="page.number",
      type="number",
      :min="1",
      :max="total || undefined",
      @blur.native="inputMode = false",
      @keyup.native.enter="onEnterPage")
  span.page
    fv-button(v-if="navigation",
      :disabled="value === total || !next",
      @click="$emit('input', value + 1)")
      .icon(:style="{ transform: icons.next }", v-html="icons.icon")
</template>

<script>
import icon from '../icons/ARR.svg';

export default {
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
    };
  },
  computed: {
    icons() {
      return {
        icon,
        next: process.env.direction === 'ltr' ? 'rotate(-90deg)' : 'rotate(90deg)',
        prev: process.env.direction === 'ltr' ? 'rotate(90deg)' : 'rotate(-90deg)',
      };
    },
    pages() {
      const list = [];
      const end = () => list.map((item) => {
        if (typeof item === 'number') {
          return {
            type: 'page',
            number: item,
          };
        }
        return item;
      });
      if (!this.total || this.total < 1) {
        list.push(this.value);
        return end();
      } if (this.total < this.size) {
        for (let i = 1; i <= this.total; i++) {
          list.push(i);
        }
        return end();
      }
      let remained = this.size;
      const offset = Math.floor(remained / 2);
      let from = this.value - offset;
      from = from < 1 ? 1 : from;
      from = from + remained > this.total ? (this.total - remained + 1) : from;
      for (let i = from; remained > 0; remained--) {
        list.push(i++);
      }
      list[0] = 1;
      const dots = {
        type: 'dots',
        text: '...',
      };
      if (list[1] !== 2) {
        list.splice(1, 0, dots);
      }
      list[list.length - 1] = this.total;
      if (list[list.length - 2] !== this.total - 1) {
        list.splice(list.length - 1, 0, dots);
      }
      return end();
    },
  },
  methods: {
    turnInputMode() {
      this.inputMode = true;
      this.$nextTick(() => {
        this.$refs.input[0].focus();
      });
    },
    onEnterPage(event) {
      this.inputMode = false;
      if (event.target.value) {
        const page = parseInt(event.target.value);
        if (page > 0 && (!this.total || page <= this.total)) {
          this.$emit('input', page);
        }
      }
    },
  },
};
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';

.fv-pagination {
  & > * {
    &:not(:first-child) {
      margin-#{$block-start}: padding(sm);
    }
  }

  & .page {
    & > .input {
      width: 6em;
      text-align: center;
    }

    & > .other {
      padding: padding(sm);
    }
  }
}
</style>
