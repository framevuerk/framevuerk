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
    position="center",
    @close="$emit('close')",
    @open="$emit('open')",
    :first-focus-on="true",
    :auto-close="false")
    fv-content.fv-no-padding
      .fv-row
        section4(v-for="(val, index) in pick",
          :class="{'fv-col-4': pick.length % 3 === 0, 'fv-col-6': pick.length % 3 !== 0 && pick.length % 2 === 0, 'fv-col-xs-12': pick.length === 1}",
          :key="index")
          label.fv-control-label.fv-text-center(v-html="locale[val]()")
          fv-input.fv-block.fv-lg.fv-text-center(ref="input",
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
import locale from 'locale'
import fvMain from './fvMain.vue'
import fvContent from './fvContent.vue'
import fvDialog from './fvDialog.vue'
import fvInput from './fvInput.vue'
import fvButton from './fvButton.vue'

export default {
  components: {
    fvMain,
    fvContent,
    fvDialog,
    fvInput,
    fvButton
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
    this.moment = require('../').dependencies.moment
    if (this.moment) {
      if (process.env.locale === 'fa') {
        this.moment.loadPersian()
      }
    }
  },
  computed: {
    fvValidate () {
      return this.$refs.inputEl.fvValidate || false
    },
    displayValue () {
      if (this.value && this.moment) {
        return this.moment.utc(this.value).format(this.displayFormat)
      } else {
        return undefined
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
      this.$forceUpdate()
    }
  }
}
</script>
