<template lang="pug">
  div
    doc-description
      | To creating content part of your app, use this component.
    doc-code
      = "<fv-main>\n"
      = "\t<fv-content>\n"
      = "\t\t<!-- Content -->\n"
      = "\t</fv-content>\n"
      = "</fv-main>\n"
    doc-example
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
      api: {}
    }
  }
}

</script>
