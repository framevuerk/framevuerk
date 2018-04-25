<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To create switch in your application, use this!
    doc-code
      = "<fv-steps></fv-steps>"
    doc-example
      .fv-row
        .fv-col-sm-12
          p Normal
          fv-steps(:steps="['Basic', 'Size', 'Price']", :value="inputs.d1")
        .fv-col-sm-12
          p Custom Template
          fv-steps(:steps="steps", :value="inputs.d2")
            template(slot="circle", slot-scope="scope")
              i(:class="scope.step.icon")
            template(slot="text", slot-scope="scope")
              h3 {{scope.step.text}}
              small {{scope.index + 1}}/{{steps.length}}
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
        d1: 0,
        d2: 1
      },
      steps: [{
        text: 'Start',
        icon: 'fa fa-check'
      }, {
        text: 'Final',
        icon: 'fa fa-home'
      }],
      api: {
        prop: [
          {
            name: 'value',
            type: 'Number',
            default: '0',
            description: 'Current step (array index)'
          },
          {
            name: 'steps (required)',
            type: 'Array',
            default: '',
            description: 'List of steps.'
          }
        ],
        scopedSlot: [
          {
            name: 'circle',
            params: '(step, highlighted: Boolean, completed: Boolean, index: Number)',
            description: 'template of number circles.'
          },
          {
            name: 'text',
            params: '(step, highlighted: Boolean, completed: Boolean, index: Number)',
            description: 'template of text shown on under circles.'
          }
        ]
      }
    }
  }
}
</script>
