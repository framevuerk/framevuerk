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
    doc-code(title="Javascript (just if you want support jalaali dates for fvDatepicker)", lang="javascript")
      = "import IDate from 'idate'\n"
      = "Framevuerk.use('date', IDate)\n"
    doc-code
      = "<fv-datepicker></fv-datepicker>"
    doc-example
      .fv-row
        .fv-col-xs-12
          h4 Usage:
        .fv-col-sm-6.fv-col-xs-12
          p Defaut
          fv-datepicker(v-model="inputs.d1", placeholder="Pick your favorite date!")
        .fv-col-sm-6.fv-col-xs-12
          p Custom Formatted
          fv-datepicker(v-model="inputs.d2", placeholder="Pick your favorite date!")
            template(slot="value", slot-scope="scope")
              i.fa.fa-calendar
              =" "
              i date:
              b  {{scope.value.getDate()}}
              i , month:
              b  {{scope.value.getMonth() + 1}}
              i , year:
              b  {{scope.value.getFullYear()}}
        .fv-col-sm-6.fv-col-xs-12
          p Disabled:
          fv-datepicker(v-model="inputs.d5", disabled, placeholder="You can't pick me!")
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

export default {
  components: {
    docApi,
    docDescription,
    docExample,
    docCode
  },
  data () {
    return {
      inputs: {
        d1: undefined,
        d2: undefined,
        d3: undefined,
        d4: new Date(),
        d5: undefined
      },
      api: {
        prop: [
          {
            name: 'value || v-model (required)',
            type: 'Date',
            default: 'undefined',
            description: 'Value of datepicker'
          },
          {
            name: 'dialog-class',
            type: '---',
            default: '""',
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
            name: 'display-format',
            type: 'Function',
            default: 'v => v.toString()',
            description: 'A function to return custom formated value in input.'
          }
        ],
        event: [
          {
            name: 'open',
            params: '---',
            description: 'Fired when dialog opened'
          },
          {
            name: 'close',
            params: '---',
            description: 'Fired when dialog closed'
          }
        ],
        method: [
          {
            name: 'open',
            params: '---',
            description: 'Open dialog'
          },
          {
            name: 'close',
            params: '---',
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
  }
}
</script>
