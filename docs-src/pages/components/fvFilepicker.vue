<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To create file picker in your application, use this!
    doc-code
      = "<fv-filepicker></fv-filepicker>"
    doc-example
      .fv-row
        .fv-col-xs-12
          h4 Usage:
        .fv-col-sm-6
          p Default:
          fv-filepicker(v-model="inputs.d1", type="blob")
          img(ref="img")
        .fv-col-sm-6
          p Type: file + Required:
          fv-filepicker(v-model="inputs.d2", required, type="file")
        .fv-col-sm-6
          p Multiple:
          fv-filepicker(v-model="inputs.d3", multiple)
        .fv-col-sm-6
          p Disabled:
          fv-filepicker(v-model="inputs.d4", disabled)
        .fv-col-sm-4
          p Type Blob + Thumbnail + Advanced Required:
          div(ref="img", v-show="inputs.d5", :style="{width: '100%', height: '120px', backgroundSize: '100% 100%'}")
          fv-filepicker(v-model="inputs.d5", @input="$refs.img.style.backgroundImage = `url('${getUrl($event)}')`", type="blob", button-class="fv-block", default-text="Select a png image...", :required="function(){ return this.value && this.value.type === 'image/png' }")
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
        d1: undefined,
        d2: undefined,
        d3: undefined,
        d4: undefined,
        d5: undefined
      },
      api: {
        prop: [
          {
            name: 'value || v-model (required)',
            type: '---',
            default: 'undefined',
            description: 'Value of filepicker'
          },
          {
            name: 'button-class',
            type: '---',
            default: '""',
            description: 'Class attr of fv-button'
          },
          {
            name: 'default-text',
            type: '---',
            default: '"Browse..." (based on your locale)',
            description: 'Default text appear to button'
          },
          {
            name: 'required',
            type: '[Boolean, Function]',
            default: 'false',
            description: 'Just like normal input required attribute. Also you can pass a function to check validity of value as you want.'
          },
          {
            name: 'disabled',
            type: 'Boolean',
            default: 'false',
            description: 'Just like normal select disabled attribute'
          },
          {
            name: 'type',
            type: 'Enum["blob", "file"]',
            default: '"blob"',
            description: 'Type of value.'
          }
        ],
        event: [],
        method: []
      }
    }
  },
  methods: {
    getUrl (v) {
      return URL.createObjectURL(v)
    }
  }
}
</script>
