<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To show toast message, use this component.
    doc-code(title="Javascript (inside your component):", lang="javascript")
      = "this.$fvToast.show('blah blah')'\n"
    doc-example
      .fv-padding
        h4 Normal
        .fv-row
          .fv-col
            label.fv-control-label Text
            fv-input.fv-form-control(placeholder="Text", v-model="inputs.d1")
          .fv-col
            label.fv-control-label Timouet
            fv-input.fv-form-control(placeholder="Timeout", type="number", v-model="inputs.d2")
          .fv-col-12
            fv-button.fv-block.fv-ok(@click="$fvToast.show(inputs.d1, inputs.d2)", icon="fa fa-eye") Show
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
        d1: 'Hello',
        d2: 3000
      },
      api: {
        method: [
          {
            name: 'show',
            params: '(text = null, timeout = 5500)',
            description: 'Show toast'
          },
          {
            name: 'hide',
            params: '',
            description: 'Manually hide toast'
          }
        ]
      }
    }
  },
  methods: {
    show (text, timeout) {
      this.$toast.show(text, timeout)
    }
  }
}
</script>
