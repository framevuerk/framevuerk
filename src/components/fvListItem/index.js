import template from './template.pug'
import style from './style.scss'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    expanded: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isExpanded: this.expanded || false
    }
  },
  computed: {
    hasSubList () {
      return this.$slots.hasOwnProperty('sub-list')
    },
    isHighlighted () {
      const bigParent = this.bigParent()
      const normalHighlighted = bigParent !== false && bigParent.highlighted === this.$el
      const shouldHighlight = normalHighlighted && (bigParent.isFocused || bigParent.tabindex < 0)
      return normalHighlighted && shouldHighlight
    }
  },
  methods: {
    expand () {
      this.isExpanded = true
      this.$emit('expand')
    },
    collapse () {
      this.isExpanded = false
      this.$emit('collapse')
    },
    toggle () {
      if (this.isExpanded) {
        this.collapse()
      } else {
        this.expand()
      }
    },
    bigParent () {
      let ret = this
      while (ret) {
        if (ret.parent) {
          return ret
        }
        ret = ret.$parent
      }
      return false
    },
    onClick (event) {
      this.$parent.highlighted = this.$el
      if (!this.disabled) {
        this.$emit('click', event)
      }
    }
  },
  style,
  render: template.render
}
