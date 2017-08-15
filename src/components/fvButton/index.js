import template from './template.pug'
import style from './style.scss'
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
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
