<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To creating content section inside
      a.fv-link(@click="$router.push(`/components/fvMain`)") fvMain
      | , use this component.
    doc-code(v-pre)
      = "<fv-content>\n"
      = "\t<!-- contents -->\n"
      = "</fv-content>\n"
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
