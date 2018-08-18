<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To show toast message, use this component.
    doc-code(title="Javascript (inside your component):", lang="javascript")
      = "this.$fvToast.show('blah blah')'\n"
    doc-example(parent)
      .fv-padding
        h4 Normal
        .fv-row
          .fv-col
            label.fv-control-label Total
            fv-input.fv-form-control(placeholder="Total", v-model="inputs.total", type="number")
          .fv-col
            label.fv-control-label Size
            fv-input.fv-form-control(placeholder="Size", type="number", v-model="inputs.size")
          .fv-col-12
            fv-pagination(:value="inputs.value", :total="numberInputs.total", :size="numberInputs.size", @input="inputs.value = $event")
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
  computed: {
    numberInputs () {
      return {
        size: this.inputs.size ? parseInt(this.inputs.size) : 0,
        total: this.inputs.total ? parseInt(this.inputs.total) : 0
      }
    }
  },
  data () {
    return {
      inputs: {
        size: 5,
        total: 0,
        value: 4
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
