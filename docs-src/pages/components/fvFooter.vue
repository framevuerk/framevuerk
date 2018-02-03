<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To creating footer inside
      =" "
      router-link.fv-link(to="/components=fvMain") fvMain
      | , use this component.
    doc-code
      = "<fv-footer>\n"
      = "\t<!-- contents -->\n"
      = "</fv-footer>\n"
    doc-example
      .fv-padding
        h4 With Buttons:
        fv-footer
          fv-button.fv-default.fv-block.fv-sm Cancel
          fv-button.fv-default.fv-block.fv-sm No
          fv-button.fv-primary.fv-block.fv-sm Yes
        br
        h4 With Texts:
        fv-footer
          .fv-grow
          .fv-title
            p Footer content
          .fv-grow
        br
        h4 Modified Height:
        fv-footer(height="35px")
          .fv-grow
          a.fv-link
            i.fa.fa.fa-github
            |  Link

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
