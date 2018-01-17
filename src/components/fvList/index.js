import locale from 'locale'
import template from './template.pug'
import style from './style.scss'
import fvListItem from '../fvListItem'
import fvButton from '../fvButton'
/* global process */

export default {
  components: {
    fvListItem,
    fvButton
  },
  props: {
    parent: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      highlighted: null,
      isFocused: false,
      notFoundText: locale.notFound()
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
      let shouldHighlightIndex = highlightedIndex;
      let tryTime = 0;
      do{
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
      this.highlighted = allItems[shouldHighlightIndex];
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
      case process.env.DIRECTION === 'ltr' ? 37 : 39: // 37: left, 39: right,
        event.preventDefault()
        if (this.highlighted && this.highlighted.__vue__) {
          this.highlighted.__vue__.collapse()
        }
        break
      case process.env.DIRECTION === 'ltr' ? 39 : 37: // 37: left, 39: right,
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
  },
  style,
  render: template.render
}
