import template from './template.pug'
import style from './style.scss'
import utility from '../../utility'

export default {
  props: {
    icon: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    highlighted: {
      type: Boolean,
      default: false
    },
    expanded: {
      type: Boolean,
      default: false
    },
    items: {
      default: () => []
    }
  },
  data () {
    return {
      pExpanded: this.expanded
    }
  },
  computed: {
    hasItems () {
      return this.items && this.items.length
    }
  },
  methods: {
    click (event, param) {
      if (!this.disabled && event.detail) {
        this.$emit('click', param)
      }
    },
    expand () {
      this.pExpanded = true
      this.$emit('expand')
    },
    collapse () {
      this.$emit('collapse')
      this.pExpanded = false
    },
    toggle () {
      if (this.pExpanded) {
        this.collapse()
      } else {
        this.expand()
      }
    }
  },
  mounted () {
    if (this.hasItems) {
      this.items.forEach(item => {
        if (item.selected) {
          this.pExpanded = true
        }
      })
    }
  },
  style,
  render: template.render
}
