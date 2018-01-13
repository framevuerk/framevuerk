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
    tabindex: {
      type: [Number, String],
      default: 0
    }
  },
  data () {
    return {
      highlighted: 0,
      isFocused: false,
      notFoundText: locale.notFound()
    }
  },
  methods: {
    highlightedEl () {
      if (this.$children.length > this.highlighted) {
        return this.$children[this.highlighted]
      } else {
        return false
      }
    },
    onFocus () {
      utility.doIt(() => {
        this.isFocused = true
      })
    },
    onBlur () {
      this.isFocused = false
    },
    onKeydown (event) {
      const highlightedEl = this.highlightedEl()
      switch (event.which) {
      case 38: // up
        event.preventDefault()
        this.highlighted = this.highlighted - 1 < 0 ? this.$children.length - 1 : this.highlighted - 1
        break
      case 40: // down
        event.preventDefault()
        this.highlighted = this.highlighted + 1 >= this.$children.length ? 0 : this.highlighted + 1
        break
      case process.env.DIRECTION === 'ltr' ? 37 : 39: // 37: left, 39: right,
        event.preventDefault()
        if (highlightedEl) {
          highlightedEl.collapse()
        }
        break
      case process.env.DIRECTION === 'ltr' ? 39 : 37: // 37: left, 39: right,
        event.preventDefault()
        if (highlightedEl) {
          highlightedEl.expand()
        }
        break
      case 13: // enter
        event.preventDefault()
        if (highlightedEl) {
          highlightedEl.click(event)
        }
        break
      }
    }
  },
  style,
  render: template.render
}
