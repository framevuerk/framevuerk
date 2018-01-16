import locale from 'locale'
import utility from '../../utility'
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
      utility.doIt(() => {
        this.isFocused = true
      })
    },
    onBlur () {
      this.isFocused = false
    },
    moveHighlight (next = true) {
      const allItems = [...this.$el.querySelectorAll('.fv-list-item')].filter(el => el.offsetHeight)
      const highlightedIndex = allItems.findIndex(el => this.highlighted === el)
      if (next) {
        this.highlighted = highlightedIndex + 1 >= allItems.length ? allItems[0] : allItems[highlightedIndex + 1]
      } else {
        this.highlighted = highlightedIndex - 1 < 0 ? allItems[allItems.length - 1] : allItems[highlightedIndex - 1]
      }
      return this.highlighted
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
