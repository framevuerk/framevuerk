<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To use framevuerk grid system, use .fv-row and .fv-col(x) classes
    doc-code
      = "<div class=\"fv-row\">\n"
      = "\t<div class=\"fv-col\"></div>\n"
      = "</div>"
    doc-example
      .fv-row.grid-example
        .fv-col fv-col
        .fv-col fv-col
        .fv-col fv-col
        .fv-col fv-col
        .fv-col fv-col
        .fv-col-12 fv-col-12
        .fv-col-6 fv-col-6
        .fv-col-6 fv-col-6
        .fv-col-8 fv-col-8
        .fv-col-4 fv-col-4
        .fv-col-md-6.fv-col-sm-12 fv-col-md-6 fv-col-sm-12
        .fv-col-md-6.fv-col-sm-12 fv-col-md-6 fv-col-sm-12
        .fv-col-md-7.fv-col-sm-12 fv-col-md-7 fv-col-sm-12
        .fv-col-md-5.fv-col-lower-sm-0 fv-col-md-5 fv-col-lower-sm-0
        .fv-col-xs-8.fv-col-offset-xs-4 fv-col-xs-8 fv-col-offset-xs-4
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

<style lang="scss">
.grid-example > [class*='fv-col'] {
  background: #383f47;
  font-family: monospace;
  border: solid 1px #f9f9f9;
  color: #f9f9f9;
  border-radius: 7px;
}
</style>
