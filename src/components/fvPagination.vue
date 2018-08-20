<template lang="pug">
.fv-input-group.fv-pagination
  fv-button.fv-sm(v-if="navigation", :disabled="value === 1 || !prev", @click="$emit('input', value - 1)")
    .icon(v-html="icons.firstPage")
  span.page(v-for="page in pages")
    b.fv-padding-small.fv-text-gray(v-if="page.type === 'dots'") ...
    fv-button.fv-sm(v-else,
      :class="{'fv-primary': page.number === value}",
      @click="$emit('input', page.number)") {{page.text || page.number}}
  fv-button.fv-sm(v-if="navigation", :disabled="value === total || !next", @click="$emit('input', value + 1)")
    .icon(v-html="icons.lastPage")
</template>

<script>
export default {
  props: {
    value: {
      type: Number
    },
    total: {
      type: Number
    },
    size: {
      type: Number
    },
    navigation: {
      type: Boolean
    },
    next: {
      type: Boolean,
      default: true
    },
    prev: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    icons () {
      const chevronLeft = require('../icons/feather/chevron-left.svg')
      const chevronRight = require('../icons/feather/chevron-right.svg')
      return {
        lastPage: process.env.direction === 'ltr' ? chevronRight : chevronLeft,
        firstPage: process.env.direction === 'ltr' ? chevronLeft : chevronRight
      }
    },
    pages () {
      const list = []
      const end = () => {
        return list.map(item => {
          if (typeof item === 'number') {
            return {
              type: 'page',
              number: item
            }
          }
          return item
        })
      }
      if (!this.total || this.total < 1) {
        list.push(this.value)
        return end()
      } else if (this.total < this.size) {
        for (let i = 1; i <= this.total; i++) {
          list.push(i)
        }
        return end()
      }
      let remained = this.size
      const offset = Math.floor(remained / 2)
      let from = this.value - offset
      from = from < 1 ? 1 : from
      from = from + remained > this.total ? (this.total - remained + 1) : from
      for (let i = from; remained > 0; remained--) {
        list.push(i++)
      }
      list[0] = 1
      const dots = {
        type: 'dots',
        text: '...'
      }
      if (list[1] !== 2) {
        list.splice(1, 0, dots)
      }
      list[list.length - 1] = this.total
      if (list[list.length - 2] !== this.total - 1) {
        list.splice(list.length - 1, 0, dots)
      }
      return end()
    }
  },
  methods: {

  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-textarea {
  @include scrollbar($bg-color);

  line-height: 1.3em;
  padding: $padding-small;

  &.auto-height {
    overflow-x: auto;
    overflow-y: hidden;
    resize: none;
    transition: height 0.1s;
  }
}
</style>
