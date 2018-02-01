<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To create switch in your application, use this!
    doc-code
      = "<fv-textarea></fv-textarea>"
    doc-example
      .fv-row
        .fv-col-sm-12
          p Normal
          fv-textarea.fv-form-control(v-model="inputs.d1", placeholder="Write something...")
        .fv-col-sm-12
          p Auto-height
          fv-textarea.fv-form-control(v-model="inputs.d2", auto-height, placeholder="Enter your message...")
        .fv-col-sm-12
          p Advanced Required
          fv-textarea.fv-form-control(v-model="inputs.d3", auto-height, placeholder="Enter 3 line of stuff!", :required="function(){ return this.value.split('\\n').length === 3 }")
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
        d2: null,
        d3: ''
      },
      api: {
        prop: [
          {
            name: 'value || v-model (required)',
            type: '',
            default: 'undefined',
            description: 'Value of textarea'
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
            description: 'Just like normal textarea disabled attribute'
          },
          {
            name: 'auto-height',
            type: 'Boolean',
            default: 'false',
            description: 'Set height automatic by content'
          }
        ],
        event: [],
        method: []
      }
    }
  }
}
</script>
