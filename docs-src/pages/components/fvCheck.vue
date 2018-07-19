<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To create radio buttons or check boxes in your application, use this!
    doc-code
      = "<fv-check></fv-check>"
    doc-example
      .fv-row
        .fv-col-6
          label.fv-form-control-label {{inputs.d1}}
          .fv-form-control
            fv-check(v-model="inputs.d1", content="iran", multiple) J.S Iran
            fv-check(v-model="inputs.d1", content="israeil", multiple) Israeil
            fv-check(v-model="inputs.d1", content="ghazbin", multiple, disabled) Ghazbin
        .fv-col-6
          label.fv-form-control-label {{inputs.d2}} {{typeof inputs.d2}}
          .fv-form-control
            fv-check(v-model="inputs.d2", content="iran") J.S Iran
            fv-check(v-model="inputs.d2", content="israeil") Israeil
        //- .fv-col
        //-   p Check Box
        //-   fv-check(v-model="inputs.d1", :options="['A.C. Milan', 'Juventus', 'Inter Milan']", value-key="", text-key="", disabled-key="", multiple)
        //- .fv-col
        //-   p Radio + Required
        //-   fv-check(v-model="inputs.d2", :options="['Amir', 'Farzad', 'Jeff']", required, value-key="", text-key="", disabled-key="")
        //- .fv-col
        //-   p Option Disabled
        //-   fv-check(v-model="inputs.d3", :options="[{value: 'Ghazvin', disabled: false}, {value: 'Tehran', disabled: false}, {value: 'Qom', disabled: true}]", text-key="value", multiple)
        //- .fv-col
        //-   p Disabled
        //-   fv-check(v-model="inputs.d4", :options="['Ronaldo', 'Messi']", disabled, value-key="", text-key="", disabled-key="")
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
        d1: ['iran'],
        d2: 'iran',
        d3: ''
      },
      api: {
        prop: [
          {
            name: 'value (required)',
            type: '',
            default: '',
            description: 'Value of input'
          },
          {
            name: 'multiple',
            type: 'Boolean',
            default: 'false',
            description: 'Allow user to select multiple options'
          },
          {
            name: 'required',
            type: '[Boolean, Function]',
            default: 'false',
            description: 'Should user select atleast one option? Also you can pass a function to check validity of value as you want.'
          },
          {
            name: 'disabled',
            type: 'Boolean',
            default: 'false',
            description: 'Disable all options'
          },
          {
            name: 'options',
            type: 'Array',
            default: '[]',
            description: 'List of options.<br>Each item in array, is object that can have<br>text:String, value:String and disabled:Boolean prop.'
          }
        ],
        event: [],
        method: []
      }
    }
  }
}

</script>
