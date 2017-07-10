import template from './template.pug'
import style from './style.scss'
import utility from '../../utility'
export default {
  props: {
    type: {
      type: String,
      default: 'button'
    }
  },
  mounted () {
    utility.vueEvents().forEach(eventName => {
      this.$refs.buttonEl.addEventListener(eventName, (event) => this.$emit(eventName, event))
    })
  },
  style,
  render: template.render
}
