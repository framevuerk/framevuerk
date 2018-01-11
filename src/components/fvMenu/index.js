import template from './template.pug'
import fvDialog from '../fvDialog'
import fvContent from '../fvContent'
import fvList from '../fvList'

export default {
  components: {
    fvDialog,
    fvContent,
    fvList
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    sheet: {
      type: [Object, Boolean],
      validator: (value) => {
        return [true, false, null].indexOf(value) > -1
      },
      default: null /* or true or false */
    },
    title: {
      type: String,
      default: ''
    },
    autoClose: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      pShow: false,
      pSheet: false,
      highlightedOption: null,
      param: null
    }
  },
  methods: {
    open (param = null) {
      this.highlightedOption = null
      this.param = param
      this.$refs.dialog.open()
    },
    close () {
      this.$refs.dialog.close()
    },
    toggle (domElem = null) {
      this[this.pShow ? 'close' : 'open'](domElem)
    },
    clickItem (p1, p2) {
      this.$emit('click-item', p1, p2)
      if (this.autoClose) {
        this.close()
      }
    }
  },
  render: template.render
}
