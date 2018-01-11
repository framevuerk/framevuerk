import utility from '../../utility'
import template from './template.pug'
import style from './style.scss'
import fvMain from '../fvMain'
import fvHeader from '../fvHeader'
import fvContent from '../fvContent'
import fvButton from '../fvButton'
/* global document */

export default {
  components: {
    fvMain,
    fvHeader,
    fvContent,
    fvButton
  },
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
      hammer: undefined,
      pValue: this.value,
      dirs: {
        next: process.env.DIRECTION === 'ltr' ? 'left' : 'right',
        prev: process.env.DIRECTION === 'ltr' ? 'right' : 'left'
      }
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
  created () {
    this.hammer = utility._dependencies.hammer
  },
  mounted () {
    if (!this.value) {
      this.changeTab(this.pTabs[0].slot)
    }
    this.initHammer()
  },
  methods: {
    changeTab (slot, emit = true) {
      let slotName
      if (typeof slot === 'number') {
        const currentIndex = this.pTabs.findIndex(t => t.slot === this.pValue)
        const newIndex = currentIndex + slot
        const n = newIndex < 0 ? this.pTabs.length - 1 : (newIndex > this.pTabs.length - 1 ? 0 : newIndex)
        slotName = this.pTabs[n].slot
      } else {
        slotName = slot
      }
      this.pValue = slotName
      if (emit) {
        this.$emit('input', slotName)
      }
      this.$emit('tab-change', slotName)
    },
    initHammer () {
      if (this.hammer) {
        const mc = new this.hammer.Manager(this.$el, {
          recognizers: [
            [this.hammer.Swipe, { direction: this.hammer.DIRECTION_HORIZONTAL }]
          ]
        })
        mc.on(`swipe${this.dirs.next}`, () => {
          this.changeTab(1)
        })
        mc.on(`swipe${this.dirs.prev}`, () => {
          this.changeTab(-1)
        })
      }
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
