<template lang="pug">
ul.fv-list(@keydown.self="onKeydown", @focus="onFocus", @blur="onBlur", :tabindex="tabindex")
  slot(v-if="$slots.default")
  fv-list-item(v-else-if="notFoundText") {{notFoundText}}
</template>

<script>
import locale from 'locale'
import fvListItem from './fvListItem.vue'
import fvButton from './fvButton.vue'

export default {
  components: {
    fvListItem,
    fvButton
  },
  props: {
    parent: {
      type: Boolean,
      default: false
    },
    notFoundText: {
      default: locale.notFound()
    }
  },
  data () {
    return {
      highlighted: null,
      isFocused: false
    }
  },
  computed: {
    tabindex () {
      return this.$attrs && this.$attrs.tabindex ? parseInt(this.$attrs.tabindex) : (this.parent ? 0 : -1)
    }
  },
  methods: {
    onFocus () {
      if (!this.highlighted) {
        this.moveHighlight()
      }
      this.isFocused = true
    },
    onBlur () {
      this.isFocused = false
    },
    moveHighlight (next = true) {
      const allItems = [...this.$el.querySelectorAll('.fv-list-item')].filter(el => el.offsetHeight)
      const highlightedIndex = allItems.findIndex(el => this.highlighted === el)
      let shouldHighlightIndex = highlightedIndex
      let tryTime = 0
      do {
        if (tryTime++ >= allItems.length) {
          this.highlighted = null
          return
        }
        if (next) {
          shouldHighlightIndex = (shouldHighlightIndex + 1) % allItems.length
        } else {
          shouldHighlightIndex = shouldHighlightIndex - 1 < 0 ? allItems.length - 1 : shouldHighlightIndex - 1
        }
      } while (allItems[shouldHighlightIndex].__vue__.disabled)
      this.highlighted = allItems[shouldHighlightIndex]
    },
    onKeydown (event) {
      switch (event.which) {
        case 38: // up
          event.preventDefault()
          this.moveHighlight(false)
          break
        case 40: // down
          event.preventDefault()
          this.moveHighlight(true)
          break
        case process.env.direction === 'ltr' ? 37 : 39: // 37: left, 39: right,
          event.preventDefault()
          if (this.highlighted && this.highlighted.__vue__) {
            this.highlighted.__vue__.collapse()
          }
          break
        case process.env.direction === 'ltr' ? 39 : 37: // 37: left, 39: right,
          event.preventDefault()
          if (this.highlighted && this.highlighted.__vue__) {
            this.highlighted.__vue__.expand()
          }
          break
        case 13: // enter
          event.preventDefault()
          if (this.highlighted && this.highlighted.__vue__) {
            this.highlighted.__vue__.onClick(event)
          }
          break
      }
    }
  },
  mounted () {
    this.moveHighlight()
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.fv-list {
  border: solid 1px $shadow-color;
  clear: both;

  & .fv-list-item:not(:last-child) {
    border-bottom: solid 1px $shadow-color-light;
  }
}
</style>
