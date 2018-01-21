import template from './template.pug'
import style from './style.scss'

export default {
  data () {
    return {
      visible: false,
      text: null,
      timer: null
    }
  },
  methods: {
    show (text = null, timeout = 5500) {
      this.hide()
      if (!this.$parent) {
        this.$mount()
        document.body.appendChild(this.$el)
      }
      this.visible = true
      this.text = text
      this.timer = setTimeout(() => {
        this.visible = false
      }, timeout)
    },
    hide () {
      this.visible = false
      clearTimeout(this.timer)
    }
  },
  style,
  render: template.render
}
