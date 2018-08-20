<template lang="pug">
  div
    doc-description
      | To create pagination component to handle data pages, use this!
    doc-code
      = "<fv-pagination></fv-pagination>"
    doc-example(parent)
      .fv-padding
        fieldset.fv-form-control-group
          legend.fv-control-label Config
          .fv-row
            .fv-col-6
              label.fv-control-label Total
              fv-input.fv-form-control(placeholder="Total", v-model="inputs.total", type="number")
            .fv-col-6
              label.fv-control-label Size
              fv-input.fv-form-control(placeholder="Size", type="number", v-model="inputs.size")
            .fv-col-4
              label.fv-control-label Navigation Buttons
              .fv-form-control
                fv-switch(v-model="inputs.navigation")
            .fv-col-4
              label.fv-control-label Next Button
              .fv-form-control
                fv-switch(v-model="inputs.next", :disabled="!inputs.navigation")
            .fv-col-4
              label.fv-control-label Prev Button
              .fv-form-control
                fv-switch(v-model="inputs.prev", :disabled="!inputs.navigation")
        .fv-row
          .fv-col-12.fv-text-center
            fv-pagination(:value="inputs.value",
              :total="numberInputs.total",
              :size="numberInputs.size",
              :navigation="inputs.navigation",
              :next="inputs.next",
              :prev="inputs.prev",
              @input="inputs.value = $event")
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
        total: 18,
        navigation: true,
        value: 4,
        next: true,
        prev: true
      },
      api: {
        prop: [
          {
            name: 'value',
            type: 'Number',
            default: '',
            description: 'Current page number.'
          },
          {
            name: 'total',
            type: 'Number',
            default: '',
            description: 'Total pages count. if you havn\'t, you can play with the <b>navigation</b>, <b>next</b> and <b>prev</b> props.'
          },
          {
            name: 'size',
            type: 'Number',
            default: '',
            description: 'Length of pages appear to pagination. if you dont set <b>total</b>, it\'s not usable.'
          },
          {
            name: 'navigation',
            type: 'Boolean',
            default: '',
            description: 'Show the next and prev buttons.'
          },
          {
            name: 'next',
            type: 'Boolean',
            default: 'true',
            description: 'Handle disabled state of next button. If you dont set <b>navigation</b>. it\'s not usable. Also if you set the <b>total</b> and <b>navigation</b> props together, component consider this as <b>false</b> if <b>value</b> equal to <b>total</b>.'
          },
          {
            name: 'prev',
            type: 'Boolean',
            default: 'true',
            description: 'Handle disabled state of prev button. If you dont set <b>navigation</b>. it\'s not usable. Also if you set the <b>total</b> and <b>navigation</b> props together, component consider this as <b>false</b> if <b>value</b> equal to <b>1</b>.'
          }
        ],
        event: [
          {
            name: 'input',
            params: 'value',
            description: 'Fired when pagination try to change <b>value</b> prop.'
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
