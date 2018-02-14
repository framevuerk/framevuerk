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
      a.fv-link(href="https://github.com/babakhani/PersianDate", target="_blank") PersianDate
      |  as dependency of framevuerk to active more features.
    doc-code(title="Javascript:", lang="javascript")
      = "import Framevuerk from 'framevuerk'\n"
      = "import PersianDate from 'persian-date'\n"
      = "Framevuerk.use('persian-date', PersianDate)\n"
    doc-code
      = "<fv-datepicker></fv-datepicker>"
    doc-example
      .fv-row
        .fv-col-xs-12
          h4 Usage:
        .fv-col-sm-6.fv-col-xs-12
          p en-gregorian:
          fv-datepicker(v-model="inputs.d1", locale="en", calendar="gregorian", placeholder="Pick your favorite date!")
        .fv-col-sm-6.fv-col-xs-12
          p fa-persian:
          fv-datepicker(v-model="inputs.d2", locale="fa", calendar="persian", placeholder="Pick your birthday", :pick="['year','month','day']", display-format="YYYY/MM/D")
        .fv-col-sm-6.fv-col-xs-12
          p Disabled:
          fv-datepicker(v-model="inputs.d5", disabled, placeholder="You can't pick me!")
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
            name: 'input-class',
            type: '---',
            default: '""',
            description: 'Class attr of fv-input'
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
            name: 'locale',
            type: 'String',
            default: '"en" (based on framevuerk version locale)',
            description: 'Pick sections of datepicker. (It\'s not works without PersianDate)'
          },
          {
            name: 'calendar',
            type: 'String',
            default: '"gregorian" (based on framevuerk version locale. you can set it to "persian" too.)',
            description: 'Calendar version of datepicker. (It\'s not works without PersianDate)'
          },
          {
            name: 'display-format',
            type: 'String',
            default: '"D MMMM YYYY, HH:mm"',
            description: 'Display format of value'
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
        ]
      }
    }
  }
}
</script>
