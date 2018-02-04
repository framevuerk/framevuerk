<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To create switch in your application, use this! Note that before using this, you can add
      =" "
      a.fv-link(href="http://hammerjs.github.io/", target="_blank") HammerJs
      |  as dependency of framevuerk to allow touch actions.
    doc-code(title="Javascript:", lang="javascript")
      = "import Framevuerk from 'framevuerk'\n"
      = "import Hammer from 'hammerjs'\n"
      = "Framevuerk.use('hammer', Hammer)\n"
    doc-code
      = "<fv-switch></fv-switch>"
    doc-example
      .fv-row
        .fv-col-sm-3
          p Normal
          fv-switch(v-model="inputs.d1")
        .fv-col-sm-3
          p Invalid
          fv-switch.focus(invalid)
        .fv-col-sm-3
          p Disabled
          fv-switch.fv-block(disabled)
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
        d1: '',
        d2: false,
        d3: null
      },
      api: {
        prop: [
          {
            name: 'value || v-model',
            type: '',
            default: 'undefined',
            description: 'Value of input'
          },
          {
            name: 'offValue',
            type: '---',
            default: 'false',
            description: 'Value of switch, when it is unchecked'
          },
          {
            name: 'onValue',
            type: '---',
            default: 'true',
            description: 'Value of switch, when it is checked'
          },
          {
            name: 'required',
            type: '[Boolean, Function]',
            default: 'false',
            description: 'Just like normal input required attribute. Also you can pass a function to check validity of value as you want.'
          },
          {
            name: 'disabled',
            type: 'Boolean',
            default: 'false',
            description: 'Just like normal input disabled attribute'
          }
        ],
        event: [],
        method: [
          {
            name: 'toggle',
            params: '---',
            description: 'Toggle value of switch'
          }
        ]
      }
    }
  }
}
</script>
