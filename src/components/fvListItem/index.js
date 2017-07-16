import template from './template.pug'
import style from './style.scss'

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
      default: []
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
    click () {
      if (!this.disabled) {
        this.$emit('click')
        if (this.hasItems) {
          this.pExpanded = !this.pExpanded
        }
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
