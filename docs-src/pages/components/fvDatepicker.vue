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
      | Note that before using this, you should add
      =" "
      a.fv-link(href="https://momentjs.com/", target="_blank") Moment
      |  as dependency of framevuerk.
    doc-code(title="Javascript:", lang="javascript")
      = "import framevuerk from 'framevuerk'\n"
      = "import moment from 'moment'  // or 'moment-jalaali'\n"
      = "framevuerk.use('moment', moment)\n"
    doc-code
      = "<fv-datepicker></fv-datepicker>"
    doc-example
      .fv-row
        .fv-col-xs-12
          h4 Usage:
        .fv-col-sm-6
          p Default:
          fv-datepicker(v-model="inputs.d1", placeholder="Pick your favorite time!")
        .fv-col-sm-6
          p Only Date Picker:
          fv-datepicker(v-model="inputs.d2", placeholder="Pick your birthday", :pick="['year','month','day']", display-format="YYYY/MM/D")
        .fv-col-sm-6
          p Only Time Picker + Required:
          fv-datepicker(v-model="inputs.d3", required, placeholder="Pick alarm time", :pick="['hour','minute']", display-format="HH:mm")
        .fv-col-sm-6
          p Custom:
          fv-datepicker(v-model="inputs.d4", required, :pick="['month']", display-format="MMMM (MM)", placeholder="Select your favorite month")
        .fv-col-sm-6
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
            name: 'pick',
            type: 'Array of Enum["year", "month", "day", "hour", "minute", "second"]',
            default: '["year", "month", "day", "hour", "minute", "second"]',
            description: 'Pick sections of datepicker.'
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
