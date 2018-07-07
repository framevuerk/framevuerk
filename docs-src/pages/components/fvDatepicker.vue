<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To create full featured date-time picker based on your locale in your application, use this! Note that this is use
      =" "
      router-link.fv-link(to="/components=fvInput") fvInput
      =" and "
      router-link.fv-link(to="/components=fvDialog") fvDialog
      | .
      br
      | Note that before using this, you can add
      =" "
      a.fv-link(href="https://github.com/nainemom/idate", target="_blank") IDate
      |  as dependency of framevuerk to support jalaali dates.
      br
      | From version 1.5.0 fv-datepicker will unselectable unvalidated dates that <i>required</i> function didn't accept them! So with this implementation, fv-datepicker will support range date limitation (from, to, etc) technically!
    doc-code(title="Javascript", description="just if you want globally support jalaali dates for fvDatepicker", lang="javascript")
      = "import IDate from 'idate'\n"
      = "Framevuerk.use('date', IDate)\n"
    doc-code
      = "<fv-datepicker></fv-datepicker>"
    doc-example
      .fv-row
        .fv-col-xs-12
          h4 Usage:
        .fv-col-lg-6.fv-col-xs-12
          p Defaut
          fv-datepicker(v-model="inputs.d1", placeholder="Pick your favorite date!")
        .fv-col-lg-6.fv-col-xs-12
          p Custom Formatted
          fv-datepicker(v-model="inputs.d2", placeholder="Pick your favorite date!", :delete-button="false")
            template(slot="value", slot-scope="scope")
              span {{scope.value.getDate()}} - {{scope.value.getMonth() + 1}} - {{scope.value.getFullYear()}}
        .fv-col-lg-6.fv-col-xs-12
          p Jalaali Date Object (Use IDate)
          fv-datepicker(v-model="inputs.d6", placeholder="Pick your favorite jalaali date!", :date-library="IDate")
        .fv-col-lg-6.fv-col-xs-12
          p Disabled:
          fv-datepicker(v-model="inputs.d5", disabled, placeholder="You can't pick me!")
        .fv-col-lg-6.fv-col-xs-12
          p Custom Required
          fv-datepicker(v-model="inputs.d4", placeholder="Pick your favorite date just in this month!", :required="dateChecker", :default-value="nextMonthSix()")
            template(slot="value", slot-scope="scope")
              i.fa.fa-calendar
              =" "
              i date:
              b  {{scope.value.getDate()}}
              i , month:
              b  {{scope.value.getMonth() + 1}}
        .fv-col-12
          fieldset.fv-form-control-group
            legend From, To + Validation
            .fv-row.fv-no-padding
              .fv-col-6
                fv-datepicker(v-model="inputs.d7", placeholder="From Date", :required="d7Checker")
              .fv-col-6
                fv-datepicker(v-model="inputs.d8", placeholder="To Date", :required="d8Checker", zdefault-value="nextMonthSix()")
        .fv-col-12
          br
        .fv-col-12
          br
        .fv-col-12
          br
        .fv-col-12
          br
    doc-api(:rows="api")
</template>

<script>
import docApi from '../../components/docApi.vue'
import docDescription from '../../components/docDescription.vue'
import docExample from '../../components/docExample.vue'
import docCode from '../../components/docCode.vue'
import IDate from 'idate'
global.IDate = IDate
export default {
  components: {
    docApi,
    docDescription,
    docExample,
    docCode
  },
  data () {
    return {
      IDate,
      inputs: {
        d1: undefined,
        d2: undefined,
        d3: undefined,
        d4: undefined,
        d5: undefined,
        d6: undefined,
        d7: undefined,
        d8: undefined
      },
      api: {
        prop: [
          {
            name: 'value (required)',
            type: '',
            default: '',
            description: 'Value of datepicker'
          },
          {
            name: 'default-value',
            type: '[Date, Number(timestamp), String(isodate)]',
            default: 'Date.now()',
            description: 'Default Value of datepicker, if value is not set yet'
          },
          {
            name: 'dialog-class',
            type: '',
            default: '',
            description: 'Class attr of fv-dialog'
          },
          {
            name: 'required',
            type: '[Boolean, Function]',
            default: 'false',
            description: 'Just like normal select required attribute. Also you can pass a function to check validity of value as you want.'
          },
          {
            name: 'disabled',
            type: 'Boolean',
            default: 'false',
            description: 'Just like normal select disabled attribute'
          },
          {
            name: 'placeholder',
            type: 'String',
            default: '""',
            description: 'Just like normal select placeholder attribute'
          },
          {
            name: 'delete-button',
            type: 'Boolean',
            default: 'true',
            description: 'Allow user to delete selected value.'
          },
          {
            name: 'date-library',
            type: '[Object, Function]',
            default: '',
            description: 'For custom dates managment, you can use custom date libs instead of native Date class.'
          }
        ],
        method: [
          {
            name: 'open',
            params: '',
            description: 'Open dialog'
          },
          {
            name: 'close',
            params: '',
            description: 'Close dialog'
          }
        ],
        scopedSlot: [
          {
            name: 'value',
            params: '(value)',
            description: 'value in input box'
          }
        ]
      }
    }
  },
  methods: {
    dateChecker (date) {
      return !!date && new Date(date.getTime()).getDate() >= 5 && new Date(date.getTime()).getDate() <= 20
    },
    d7Checker (date) {
      if (!date || !this.inputs.d8) {
        return true
      }
      return date.getTime() < this.inputs.d8.getTime()
      // return !!date && new Date(date.getTime()).getDate() >= 5 && new Date(date.getTime()).getDate() <= 20
    },
    d8Checker (date) {
      return this.inputs.d7 && date && date.getTime() > this.inputs.d7.getTime()
      // return !!date && new Date(date.getTime()).getDate() >= 5 && new Date(date.getTime()).getDate() <= 20
    },
    nextMonthSix () {
      const dt = new Date()
      dt.setDate(6)
      dt.setMonth(dt.getMonth() + 1)
      return dt
    }
  }
}
</script>
