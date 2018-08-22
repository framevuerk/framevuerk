<template lang="pug">
  div
    doc-description
      | To creating sidebar part of your app, use this component.
    doc-code
      = "<fv-main>\n"
      = "\t<fv-sidebar v-model=\"yourBooleanVar\" :pin.sync=\"yourBooleanVar2\">\n"
      = "\t\t<!-- Content -->\n"
      = "\t</fv-sidebar>\n"
      = "</fv-main>\n"
    doc-features(:features="features")
    doc-example(parent)
      fv-sidebar(:value="inputs.s1", :pin="true", position="right", width="170px")
        h3.fv-text-center.fv-padding I'm Pinned at Right!
      fv-sidebar(v-model="inputs.s2", :pin="false", position="left", width="170px")
        h3.fv-text-center.fv-padding I'm Unpinned at Left!
      fv-content.fv-row
        fv-button.fv-block(@click="inputs.s1 = !inputs.s1") Pinned at Right
        .fv-padding-small
        fv-button.fv-block(@click="inputs.s2 = !inputs.s2") Unpinned at Left
    doc-api(:rows="api")
</template>

<script>
import docApi from '../../components/docApi.vue'
import docDescription from '../../components/docDescription.vue'
import docExample from '../../components/docExample.vue'
import docCode from '../../components/docCode.vue'
import docFeatures from '../../components/docFeatures.vue'

export default {
  components: {
    docApi,
    docDescription,
    docExample,
    docCode,
    docFeatures
  },
  data () {
    return {
      inputs: {
        s1: true,
        s2: false
      },
      features: [
        'Developer Friendly',
        'Handle Mobile Back Button',
        'Editable'
      ],
      api: {
        prop: [
          {
            name: 'value',
            type: 'Boolean',
            default: 'Based on viewport size.',
            description: 'Visibility of sidebar.'
          },
          {
            name: 'pin',
            type: 'Boolean',
            default: 'Based on viewport size.',
            description: 'Pin sidebar to <b>fv-main</b> parent.'
          },
          {
            name: 'position',
            type: 'Enum ["left", "right"]',
            default: 'Based on direction field in user config.',
            description: 'Position of sidebar.'
          }
        ],
        event: [
          {
            name: 'input',
            params: '(value)',
            description: 'Fired when sidebar try to change <b>value</b> prop. If you set <b>pin</b> to false, you should handle this or close sidebar manually after opened.'
          },
          {
            name: 'update:pin',
            params: '(value)',
            description: 'Fired when sidebar try to change <b>pin</b> prop when mounted.'
          },
          {
            name: 'open',
            params: '',
            description: 'Fired when sidebar opened.'
          },
          {
            name: 'close',
            params: '',
            description: 'Fired when sidebar closed.'
          }
        ]
      }
    }
  }
}
</script>
