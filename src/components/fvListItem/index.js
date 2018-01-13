import utility from '../../utility'
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
      return this.$parent.highlightedEl().$el === this.$el
    }
  },
  methods: {
    expand () {
      this.isExpanded = true
      this.$emit('expand')
      utility.doIt(() => {
        this.$refs.subList.children[0].focus()
      })
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
    click (event) {
      const index = this.$parent.$children.findIndex(c => c.$el === this.$el)
      this.$parent.highlighted = index
      if (!this.disabled) {
        this.$emit('click', event)
      }
    }
  },
  style,
  render: template.render
}
