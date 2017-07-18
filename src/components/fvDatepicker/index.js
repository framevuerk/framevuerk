import utility from '../../utility'
import locale from 'locale'
import template from './template.pug'
import style from './style.scss'
/* global CONFIG */

export default {
  props: {
    value: {
      default: undefined
    },
    inputClass: {
      default: ''
    },
    dialogClass: {
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    pick: {
      type: Array,
      validator: (v) => {
        for (let i = 0; i < v.length; i++) {
          if ([
            'year',
            'month',
            'day',
            'hour',
            'minute',
            'second'
          ].indexOf(v) === -1) {
            return false
          }
        }
        return true
      },
      default: () => ['year', 'month', 'day', 'hour', 'minute', 'second']
    },
    placeholder: {
      type: String,
      default: ''
    },
    displayFormat: {
      default: locale.momentDisplayFormat()
    }
  },
  data () {
    return {
      locale,
      moment: undefined, // will set on created
      pValue: undefined,
      highlightedOption: 0
    }
  },
  created () {
    this.moment = utility._dependencies.moment
    if (this.moment) {
      if (CONFIG.LOCALE === 'fa') {
        this.moment.loadPersian()
      }
    } else {
      throw new Error('Moment not found!')
    }
  },
  computed: {
    dialogButtons () {
      const ret = []
      ret.push({
        icon: 'fa fa-times',
        text: locale.cancel(),
        class: 'fv-default',
        action: () => {
          this.close()
        }
      })
      if (this.value) {
        ret.push({
          icon: 'fa fa-circle-o',
          text: locale.clear(),
          class: 'fv-default',
          action: () => {
            this.$emit('input', undefined)
            this.close()
          }
        })
      }
      ret.push({
        icon: 'fa fa-check',
        text: locale.ok(),
        class: 'fv-primary',
        action: () => {
          this.$emit('input', this.pValue.toDate())
          this.close()
        }
      })
      return ret
    },
    displayValue () {
      if (this.value) {
        return this.moment.utc(this.value).format(this.displayFormat)
      } else {
        return undefined
      }
    },
    sectionSize () {
      if (this.pick.length % 3 === 0) {
        return 4
      }
      if (this.pick.length % 2 === 0) {
        return 6
      }
      if (this.pick.length % 1 === 0) {
        return 12
      }
      return 4
    }
  },
  methods: {
    open () {
      let date
      if (this.value && this.value.constructor === Date) {
        date = this.value
      } else {
        date = new Date()
      }
      this.pValue = this.moment.utc(date)
      this.$refs.dialog.open()
    },
    close () {
      this.$refs.dialog.close()
    },
    pMath (action = 'add', type = 'day') {
      this.pValue[action](1, type + 's')
      this.$forceUpdate()
    },
    keydown (event) {
      switch (event.which) {
      case 38: // up
        if (this.highlightedOption !== null) {
          this.pMath('add', this.pick[this.highlightedOption])
        }
        break
      case 40: // down
        if (this.highlightedOption !== null) {
          this.pMath('subtract', this.pick[this.highlightedOption])
        }
        break
      case CONFIG.DIRECTION === 'ltr' ? 37 : 39: // 37: left, 39: right,
        this.highlightedOption = this.highlightedOption == null ? this.pick.length : this.highlightedOption
        this.highlightedOption = this.highlightedOption - 1 < 0 ? this.pick.length - 1 : this.highlightedOption - 1
        break
      case CONFIG.DIRECTION === 'ltr' ? 39 : 37: // 37: left, 39: right,
        this.highlightedOption = this.highlightedOption == null ? -1 : this.highlightedOption
        this.highlightedOption = this.highlightedOption + 1 >= this.pick.length ? 0 : this.highlightedOption + 1
        break
      }
    }
  },
  style,
  render: template.render
}
