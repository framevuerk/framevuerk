<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To create full featured input in your application, use this!
    doc-code
      = "<fv-input></fv-input>"
    doc-example
      .fv-row
        .fv-col-xs-12
          h4 Sizes:
        .fv-col-sm-6
          p X-Small
          fv-input.fv-xs.fv-block(placeholder=".fv-xs")
        .fv-col-sm-6
          p Small
          fv-input.fv-sm.fv-block(placeholder=".fv-sm")
        .fv-col-sm-6
          p Medium (default)
          fv-input.fv-md.fv-block(placeholder=".fv-md")
        .fv-col-sm-6
          p Large
          fv-input.fv-lg.fv-block(placeholder=".fv-lg")
        .fv-col-sm-6
          p X-Large
          fv-input.fv-xl.fv-block(placeholder=".fv-xl")
        .fv-row
          hr.fv-hr
      .fv-row
        .fv-col-xs-12
          h4 States:
        .fv-col-sm-6
          p Invalid
          fv-input.fv-block(placeholder="[invalid]", invalid)
        .fv-col-sm-6
          p Disabled
          fv-input.fv-block(placeholder="[disabled]", disabled)
        .fv-row
          hr
      .fv-row
        .fv-col-xs-12
          h4 Usage:
        .fv-col-sm-12
          p Default:
          fv-input.fv-block(v-model="inputs.d1", placeholder="Enter your age")
        .fv-col-sm-12
          p Required:
          fv-input.fv-block(v-model="inputs.d2", placeholder="Enter your father name", required)
        .fv-col-sm-12
          p Advanced Required:
          fv-input.fv-block(v-model="inputs.d3", placeholder="Enter mobile number", :required="function(){ return this.value.length === 11 && this.value.indexOf('09') === 0 }")
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
        d2: '',
        d3: ''
      },
      api: {
        prop: [
          {
            name: 'value (required)',
            type: '',
            default: 'undefined',
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
            description: 'Just like normal input disabled attribute'
          },
          {
            name: 'placeholder',
            type: 'String',
            default: '',
            description: 'Just like normal input placeholder attribute'
          }
        ]
      }
    }
  }
}
</script>
