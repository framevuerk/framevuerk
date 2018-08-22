<template lang="pug">
  div
    doc-description
      | To creating header in your app, use this component.
    doc-code
      = "<fv-main>\n"
      = "\t<fv-header>\n"
      = "\t\t<!-- Content -->\n"
      = "\t</fv-header>\n"
      = "</fv-main>\n"
    doc-example
      .fv-padding
        h4 Default:
        fv-header
          .title
            h2 Hello
        br
        h4 Custom elements and .fv-default class:
        fv-header.fv-default
          fv-input.fv-grow(placeholder="Type anything to search!")
          span.fv-margin-small
          fv-Button
            .icon(v-html="require('../../../src/icons/feather/search.svg')")
        br
        h4 With description:
        fv-header
          fv-button
            .icon(v-html="require('../../../src/icons/feather/chevron-left.svg')")
          span.fv-margin-small
          .title
            h2 Framevuerk
            p Support both rtl and ltr.
          span.fv-margin-small
          fv-Button
            .icon(v-html="require('../../../src/icons/feather/menu.svg')")
        br
        h4 With link:
        fv-header.fv-default
          .title
            h2 Twitter
          span.fv-margin-small
          a.fv-link I'm Link
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
    }
  }
}
</script>
