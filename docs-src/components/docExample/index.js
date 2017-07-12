import template from './template.pug'
import style from './style.scss'

export default {
  mounted () {
    console.log(this)
  },
  style,
  render: template.render
}
