import template from './template.pug'
import style from './style.scss'

export default {
  props: {
    lang: {
      type: String
    }
  },
  style,
  render: template.render
}
