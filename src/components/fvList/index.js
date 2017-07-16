import template from './template.pug'
import style from './style.scss'
/* global CONFIG */

export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    expanded: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      highlightedOption: null
    }
  },
  methods: {
    clickItem (item, index = false) {
      this.$emit('click-item', item)
      if (item.action) {
        item.action()
      }
      if (!item.disabled && index !== false) {
        this.highlightedOption = index
      }
    },
    pKeyDown (event) {
      if (event.target !== this.$el) {
        return
      }
      switch (event.which) {
      case 38: // up
        this.highlightedOption = this.highlightedOption == null ? this.items.length : this.highlightedOption
        this.highlightedOption = this.highlightedOption - 1 < 0 ? this.items.length - 1 : this.highlightedOption - 1
        break
      case 40: // down
        this.highlightedOption = this.highlightedOption == null ? -1 : this.highlightedOption
        this.highlightedOption = this.highlightedOption + 1 >= this.items.length ? 0 : this.highlightedOption + 1
        break
      case CONFIG.DIRECTION === 'ltr' ? 37 : 39: // 37: left, 39: right,
        if (this.highlightedOption !== null) {
          this.$refs.items[this.highlightedOption].collapse()
        }
        break
      case CONFIG.DIRECTION === 'ltr' ? 39 : 37: // 37: left, 39: right,
        if (this.highlightedOption !== null) {
          this.$refs.items[this.highlightedOption].expand()
        }
        break
      case 13: // enter
        event.preventDefault()
        if (this.highlightedOption !== null) {
          this.clickItem(this.items[ this.highlightedOption ])
        }
        break
      }
    }
  },
  style,
  render: template.render
}
