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
      = "<fv-range></fv-range>"
    doc-example
      .fv-row
        .fv-col-12
          p Normal {{inputs.d1}}
          fv-range(v-model="inputs.d1", :data="{from: 10, to: 20}")
        .fv-col-12
          p Normal {{inputs.d2}}
          fv-range(v-model="inputs.d2", multiple)
        .fv-col-12
          p Normal {{inputs.d3}}
          fv-range(v-model="inputs.d3", :data="[1,3,6,8,13]", disabled)

        //- .fv-col-sm-3
        //-   p Invalid
        //-   //fv-range.focus(invalid)
        //- .fv-col-sm-3
        //-   p Disabled
        //-   //fv-range.fv-block(disabled)
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
        d1: 1,
        d2: [1, 4],
        d3: 6
      },
      api: {
        prop: [
          {
            name: 'value',
            type: '',
            default: '',
            description: 'Value of input'
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
            description: 'Just like normal input disabled attribute.'
          },
          {
            name: 'multiple',
            type: 'Boolean',
            default: 'false',
            description: 'Allow user to select from, to values.'
          }
        ],
        event: [],
        method: [
          {
            name: 'toggle',
            params: '',
            description: 'Toggle value of switch'
          }
        ]
      }
    }
  }
}
</script>
