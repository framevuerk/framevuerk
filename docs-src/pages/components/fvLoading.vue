<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To create loading spinner, use this component. Base size is 1.3em and growing up and down by parent font-size changes.
    doc-code(title="HTML:", lang="html")
      = "<fv-loading></fv-loading>"
    doc-example(parent)
      .fv-padding
        h4 Normal
        div
          fv-loading
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
