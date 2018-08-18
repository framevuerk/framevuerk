<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To creating sidebar inside
      =" "
      router-link.fv-link(to="/components=fvMain") fvMain
      | , use this component.
    doc-code
      = "<fv-sidebar>\n"
      = "\t<!-- contents -->\n"
      = "</fv-sidebar>\n"
    doc-example(parent)
      fv-sidebar(:visible="inputs.s1", :pin="true", position="right", width="170px")
        h3.fv-text-center.fv-padding I'm Pinned at Right!
      fv-sidebar(:visible.sync="inputs.s2", :pin="false", position="left", width="170px")
        h3.fv-text-center.fv-padding I'm Unpinned at Left!
      fv-sidebar(:visible.sync="inputs.s3", :pin="false", position="left", width="50px")
        ul
          li.fv-text-center.fv-vertical-padding
            i.fa.fa-facebook.fa-2x
          li.fv-text-center.fv-vertical-padding
            i.fa.fa-telegram.fa-2x
          li.fv-text-center.fv-vertical-padding
            i.fa.fa-twitter.fa-2x
      fv-content.fv-row
        fv-button.fv-block.fv-warning(@click.native="inputs.s1 = !inputs.s1") Pinned at Right
        br
        fv-button.fv-block.fv-primary(@click.native="inputs.s2 = !inputs.s2") Unpinned at Left
        br
        fv-button.fv-block.fv-danger(@click.native="inputs.s3 = !inputs.s3") Modified Width
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
      inputs: {
        s1: true,
        s2: false,
        s3: false
      },
      api: {
        prop: [
          {
            name: 'width',
            type: 'String',
            default: '\'250px\'',
            description: 'Width of sidebar'
          },
          {
            name: 'position',
            type: 'Enum ["left", "right", null]',
            default: 'null',
            description: 'Position of sidebar. if it\'s null, value calculate based on main direction!'
          },
          {
            name: 'pin',
            type: 'Enum [true, false, null]',
            default: 'null',
            description: 'Determines whether the sidebar should be pinned or not.<br>Null means sidebar will be pinned/unpinned depends on the viewport.'
          }
        ],
        event: [
          {
            name: 'open',
            params: '',
            description: 'Fired when sidebar opened'
          },
          {
            name: 'close',
            params: '',
            description: 'Fired when sidebar closed'
          }
        ]
      }
    }
  }
}
</script>
