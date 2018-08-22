<template lang="pug">
  div
    doc-description
      | This is the main part of Framevuerk. For use the most of our components, you should put them into this container for best styles matching. It's very simple as follows:
    doc-code(v-pre)
      = "<fv-main>\n"
      = "\t<!-- Your App -->\n"
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
      api: {
        props: [
          {
            name: 'parent',
            type: 'Boolean',
            default: 'true',
            description: 'If true, all children dialogs overlays on this.'
          }
        ]
      }
    }
  }
}
</script>
