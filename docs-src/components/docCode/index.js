import template from './template.pug'
import style from './style.scss'

export default {
  data(){
    return {
      highlightjs: '',
      v: ''
    }
  },
  props: {
    title: String,
    lang: {
      type: String,
      default: 'html'
    }
  },
  style,
  render: template.render
}
