<template lang="pug">
.fv-input-group.fv-pagination
  fv-button.fv-sm(v-if="showNavigateButtons")
    .icon(v-html="icons.firstPage")
  fv-button.fv-sm(v-for="page in pages",
    :disabled="page.type === 'dots'",
    :class="{'fv-primary': page.number === value}",
    @click="$emit('input', page.number)") {{page.text || page.number}}
  fv-button.fv-sm(v-if="showNavigateButtons")
    .icon(v-html="icons.lastPage")
</template>

<script>
export default {
  props: {
    value: {
      default: undefined
    },
    total: {
      type: Number
    },
    size: {
      type: Number
    }
  },
  computed: {
    showNavigateButtons () {
      return !this.total
    },
    icons () {
      const chevronsLeft = require('../icons/feather/chevrons-left.svg')
      const chevronsRight = require('../icons/feather/chevrons-right.svg')
      return {
        lastPage: process.env.direction === 'ltr' ? chevronsRight : chevronsLeft,
        firstPage: process.env.direction === 'ltr' ? chevronsLeft : chevronsRight
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
      if (!this.total) {
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
