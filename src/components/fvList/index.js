import template from './template.pug'
import style from './style.scss'

export default {
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    pItems () {
      let ret = []
      this.items.forEach((value, index) => {
        value = typeof value !== 'object' || value === null ? {text: value} : value
        ret.push(Object.assign(value, {
          index: value.index || index,
          key: value.key || value.text || value,
          icon: value.icon || false,
          text: value.text || value,
          disabled: value.disabled || false,
          selected: value.selected || false,
          highlighted: value.highlighted || false,
          action: value.action || function () {}
        }))
      })
      return ret
    }
  },
  methods: {
    clickItem (item) {
      if (!item.disabled) {
        this.$emit('click-item', item)
        item.action()
      }
    }
  },
  style,
  render: template.render
}
