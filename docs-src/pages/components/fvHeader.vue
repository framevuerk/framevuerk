<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To creating header inside
      =" "
      router-link.fv-link(to="/components=fvMain") fvMain
      | , use this component.
    doc-code
      = "<fv-header>\n"
      = "\t<!-- contents -->\n"
      = "</fv-header>\n"
    doc-example
      .fv-padding
        h4 Default:
        fv-header
          .title
            h2 Hello
        br
        h4 With .fv-primary class:
        fv-header.fv-primary
          .title
            h2 Hello
          .space
          fv-button(icon="fa fa-search")
        br
        h4 Custom elements:
        fv-header.fv-default
          fv-input.fv-grow(placeholder="Type anything to search!")
          .space
          fv-button(icon="fa fa-search")
        br
        h4 With Buttons and description and .fv-secondary class:
        fv-header.fv-secondary
          fv-button(icon="fa fa-chevron-left")
          .space
          .title
            h2 Framevuerk
            p Support both rtl and ltr.
          .space
          fv-button(icon="fa fa-bars")
        br
        h4 With link:
        fv-header
          fv-button(icon="fa fa-chevron-left")
          .space
          .title
            h2 Twitter
          .space
          a.fv-link I'm Link
        br
        h4 Modified height:
        fv-header
          i.fa.fa-apple
          .space
          .title
            h4 Simple app
          .space
          small 18:49

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
            default: '\'55px\'',
            description: 'Height of element'
          }
        ]
      }
    }
  }
}
</script>
