import utility from '../../utility'
import locale from 'locale'
import template from './template.pug'
/* global process */

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
      type: [Boolean, Function],
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
      pValue: undefined
    }
  },
  created () {
    this.moment = utility._dependencies.moment
    global.moment = utility._dependencies.moment
    if (this.moment) {
      if (process.env.LOCALE === 'fa') {
        this.moment.loadPersian()
      }
    } else {
      throw new Error('Moment not found!')
    }
  },
  computed: {
    fvValidate () {
      return this.$refs.inputEl.fvValidate || false
    },
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
        class: 'fv-ok',
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
      if (this.pick.length === 1) {
        return 12
      } else if (this.pick.length === 2 || this.pick.length === 4) {
        return 6
      } else {
        return 4
      }
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
    pSet (unit, value) {
      const oldValue = parseInt(this.pValue.format(locale.momentDisplayFormat(unit)))
      const newValue = parseInt(value)
      if (newValue > oldValue) {
        this.pValue.add(newValue - oldValue, `${unit}s`)
      } else if (newValue < oldValue) {
        this.pValue.subtract(oldValue - newValue, `${unit}s`)
      } else {
        this.pValue.subtract(0, `${unit}s`)
      }
      this.inputPick = undefined
      this.$forceUpdate()
    }
  },
  render: template.render
}
