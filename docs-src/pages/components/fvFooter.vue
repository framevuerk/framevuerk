<template lang="pug">
  div
    doc-description
      | To creating content part of your app, use this component.
    doc-code
      = "<fv-main>\n"
      = "\t<fv-footer>\n"
      = "\t\t<!-- Content -->\n"
      = "\t</fv-footer>\n"
      = "</fv-main>\n"
    doc-example
      .fv-padding
        fv-footer.fv-text-center
          p Footer content
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
      api: {
        prop: [
          {
            name: 'height',
            type: 'String',
            default: '\'65px\'',
            description: 'Height of element'
          }
        ]
      }
    }
  }
}
</script>
