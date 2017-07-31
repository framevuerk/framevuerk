import template from './template.pug'
import style from './style.scss'
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  style,
  render: template.render
}
