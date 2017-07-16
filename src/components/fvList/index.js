import template from './template.pug'
import style from './style.scss'

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
      pValue: []
    }
  },
  methods: {
    clickItem (item) {
      if (item.action) {
        item.action()
      }
    }
  },
  style,
  render: template.render
}
