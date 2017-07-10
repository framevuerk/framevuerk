import utility from '../../utility'
import template from './template.pug'
import style from './style.scss'

export default {
  mounted () {
    utility.vueEvents().forEach(eventName => {
      this.$refs.el.addEventListener(eventName, (event) => this.$emit(eventName, event))
    })
  },
  style,
  render: template.render
}
