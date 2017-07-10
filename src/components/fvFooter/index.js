import template from './template.pug'
import style from './style.scss'

export default {
  props: {
    height: {
      type: Number,
      default: 65
    }
  },
  watch: {
    height () {
      this.setHeight()
    }
  },
  mounted () {
    this.setHeight()
  },
  methods: {
    setHeight () {
      this.$el.style.height = `${this.height}px`
      this.$el.style.minHeight = `${this.height}px`
      this.$el.style.maxHeight = `${this.height}px`
    }
  },
  style,
  render: template.render
}
