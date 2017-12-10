import template from './template.pug'
import style from './style.scss'
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    icon: {
      default: ''
    },
    text: {
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    click (e) {
      if (!this.loading) {
        this.$emit('click', e)
      }
    }
  },
  style,
  render: template.render
}
