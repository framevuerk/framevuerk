<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | This is the main part of framevuerk.
      =" "
      router-link.fv-link(to="/components=fvHeader") fvHeader
      =", "
      router-link.fv-link(to="/components=fvContent") fvContent
      =", "
      router-link.fv-link(to="/components=fvSidebar") fvSidebar
      =", "
      router-link.fv-link(to="/components=fvFooter") fvFooter
      |  and also all dialog-style components make use of this container for best styles matching. It's very simple as follows:
    doc-code(v-pre)
      = "<fv-main>\n"
      = "\t<!-- contents -->\n"
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
