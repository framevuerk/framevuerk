import template from './template.pug'
import style from './style.scss'

export default {
  props: {
    tabs: {
      type: Array
    },
    value: {
      default: undefined
    }
  },
  data () {
    return {
      pValue: this.value
    }
  },
  computed: {
    pTabs () {
      let ret = []
      this.tabs.forEach((value, index) => {
        ret.push({
          index,
          slot: value.slot || value.title || value,
          icon: value.icon || false,
          title: value.title || value,
          disabled: value.disabled || false
        })
      })
      return ret
    }
  },
  mounted () {
    if (!this.value) {
      this.changeTab(this.pTabs[0].slot)
    }
  },
  methods: {
    changeTab (slotName, emit = true) {
      if (emit) {
        this.$emit('input', slotName)
      }
      this.pValue = slotName
      this.$emit('tab-change', slotName)
    }
  },
  watch: {
    value () {
      if (this.value !== this.pValue) {
        this.changeTab(this.value, false)
      }
    }
  },
  style,
  render: template.render
}
