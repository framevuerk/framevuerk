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
    disabledKey: {
      type: String,
      default: 'disabled'
    },
    textKey: {
      type: String,
      default: 'text'
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
      userArgument: null
    }
  },
  methods: {
    open (userArgument = null) {
      this.userArgument = userArgument
      this.$refs.dialog.open()
    },
    close () {
      this.$refs.dialog.close()
    },
    toggle (domElem = null) {
      this[this.pShow ? 'close' : 'open'](domElem)
    },
    itemProp (item, prop = 'text') {
      switch (prop) {
      case 'text':
        return this.textKey ? item[this.textKey] : item
      case 'disabled':
        return this.disabledKey ? item[this.disabledKey] : false
      }
    },
    clickItem (item) {
      this.$emit('click-item', item, this.userArgument)
      if (this.autoClose) {
        this.close()
      }
    }
  },
  render: template.render
}
