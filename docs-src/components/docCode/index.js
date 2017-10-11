import template from './template.pug'
import style from './style.scss'

export default {
  props: {
    title: String,
    lang: {
      type: String
    }
  },
  style,
  render: template.render
}
