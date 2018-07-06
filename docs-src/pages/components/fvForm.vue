<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To create form in your application to handle inputs inside it, use this!
    doc-code
      = "<fv-form></fv-form>"
    doc-example
      fv-form.fv-row
        .fv-col
          p Check Box
          .fv-form-control
            fv-check(v-model="inputs.d1", v-for="i in ['A.C. Milan', 'Juventus']", :key="i", :label="i", :content="i", multiple)
        .fv-col
          p Radio + Required
          .fv-form-control
            fv-check(v-model="inputs.d2", v-for="i in ['Amir', 'Farzad']", required, :key="i", :label="i", :content="i")
        .fv-col
          label.fv-control-label Switch
          .fv-form-control
            fv-switch(v-model="inputs.d3", required)
        .fv-col
          label.fv-control-label Input
          .fv-form-control.fv-input-group.fv-flex
            fv-input.fv-grow(v-model="inputs.d4.value", :display-value="inputs.d4.displayValue", render-type="display", placeholder="Type something", required)
            fv-button(@click.native.prevent="inputs.d4.value = new Date().getTime(); inputs.d4.displayValue = new Date(inputs.d4.value).getMilliseconds();") OK
        .fv-col
          label.fv-control-label Range
          .fv-form-control
            fv-range(v-model="inputs.d12", :data="[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]", required)
        .fv-col-6
          label.fv-control-label Select
          fv-select.fv-form-control(v-model="inputs.d5", placeholder="Select your city", :options="[{text: 'Tehran', value: 'teh'}, {text: 'LA', value: 'la'}]", required)
        .fv-col-sm-12
          label.fv-control-label Textarea
          fv-textarea.fv-form-control(v-model="inputs.d6", auto-height, placeholder="Enter your message...", required)
        .fv-col-xs-12
          hr.fv-hr
        .fv-col-sm-12
          fv-button.fv-pull-end.fv-primary(type="submit") Submit!
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
        d1: [],
        d2: [],
        d3: '',
        d4: {
          value: '',
          displayValud: ''
        },
        d5: undefined,
        d6: 'salam\nkhubi?',
        d7: '',
        d8: '',
        d9: '',
        d10: '',
        d11: '',
        d12: [3, 4]
      },
      api: {
        event: [
          {
            name: 'submit',
            params: '',
            description: 'Fired when form submitted'
          },
          {
            name: 'reject',
            params: '(first-invalid-child)',
            description: 'Fired when form rejected on submit'
          }
        ],
        method: [
          {
            name: 'submit',
            params: '',
            description: 'Submit form.'
          }
        ]
      }
    }
  }
}
</script>
