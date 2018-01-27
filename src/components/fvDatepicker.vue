<template lang="pug">
span
  fv-input(:class="inputClass",
    :display-value="displayValue",
    :placeholder="placeholder",
    :required="required",
    :disabled="disabled",
    :value="value",
    render-type="display",
    caret-icon="fa fa-calendar-o",
    @enter="open()",
    ref="inputEl")
  fv-dialog.fv-datepicker(ref="dialog",
    :class="dialogClass",
    position="center-bottom",
    @close="$emit('close')",
    @open="$emit('open')",
    :first-focus-on="true",
    :auto-close="false")
    fv-content.fv-no-padding
      .fv-row
        section.fv-pick-section(v-for="(val, index) in pick",
          :key="index",
          :class="{'fv-col-xs-4': sectionSize === 4, 'fv-col-xs-6': sectionSize === 6, 'fv-col-xs-12': sectionSize === 12}")
          label.fv-control-label.fv-text-center(v-html="locale[val]()")
          fv-input.search-style.fv-block.fv-lg.fv-text-center(ref="input",
            :value="pValue?  pValue.format(locale.momentDisplayFormat(val)): ''",
            @blur.native="$event.target.value = pValue.format(locale.momentDisplayFormat(val))",
            @input="pSet(val, $event)",
            required,
            type="number")
    fv-footer
      .fv-grow
      fv-button(icon="fa fa-times",
        :text="locale.cancel()",
        @click="close()")
      fv-button(v-if="value",
        icon="fa fa-circle-o",
        :text="locale.clear()",
        @click="$emit('input', undefined); close();")
      fv-button.fv-ok(icon="fa fa-check",
        :text="locale.ok()",
        @click="$emit('input', pValue.toDate()); close();")
</template>

<script>
import utility from '../utility'
import locale from 'locale'
import fvMain from './fvMain.vue'
import fvContent from './fvContent.vue'
import fvDialog from './fvDialog.vue'
import fvInput from './fvInput.vue'

export default {
  components: {
    fvMain,
    fvContent,
    fvDialog,
    fvInput
  },
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
          ].indexOf(v[i]) === -1) {
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
    if (this.moment) {
      if (process.env.config.locale === 'fa') {
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
    focus () {
      this.$refs.inputEl.$el.focus()
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
  }
}
</script>
