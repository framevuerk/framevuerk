import template from './template.pug'
import style from './style.scss'
import fvSlider from '../fvSlider'
/* global process */

export default {
  components: {
    fvSlider
  },
  props: {
    src: {
      type: [Array, String],
      default: () => []
    },
    showButtons: {
      type: Boolean,
      default: false
    },
    interval: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      value: undefined
    }
  },
  computed: {
    images () {
      if (typeof this.src === 'string') {
        return [this.src]
      }
      return this.src
    }
  },
  style,
  render: template.render
}
