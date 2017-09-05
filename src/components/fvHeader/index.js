import template from './template.pug'
import style from './style.scss'

export default {
  props: {
    height: {
      type: [Number, String],
      default: 55
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
      const height = typeof this.height === 'number' ? `${this.height}px` : this.height;
      this.$el.style.height = height
      this.$el.style.minHeight = height
      this.$el.style.maxHeight = height
    }
  },
  style,
  render: template.render
}
