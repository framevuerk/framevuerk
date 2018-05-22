<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To create normall and multiple range slider in your application, use this!
    doc-code
      = "<fv-range></fv-range>"
    doc-example
      .fv-row
        .fv-col-12
          p Normal
          fv-range(v-model="inputs.d1", :data="{from: 1, to: 20}", required)
        .fv-col-12
          p Multiple
          fv-range(v-model="inputs.d2", multiple)
        .fv-col-12
          p Disabled
          fv-range(v-model="inputs.d3", :data="[1,3,6,8,13]", disabled)

        .fv-col-12
          p Invalid
          fv-range.focus(v-model="inputs.d4", invalid)
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
        d1: 22,
        d2: [1, 4],
        d3: 6,
        d4: 1
      },
      api: {
        prop: [
          {
            name: 'value',
            type: '',
            default: '',
            description: 'Value of input.'
          },
          {
            name: 'required',
            type: '[Array, Object]',
            default: '{ from: 1, to: 10}',
            description: 'List of available data or just Object with from:Number and to:Number keys.'
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
        ]
      }
    }
  }
}
</script>
