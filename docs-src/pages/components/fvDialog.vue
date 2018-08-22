<template lang="pug">
div
  doc-description
    | To create full featured dialog in your application, use this!
  doc-code
    = "<fv-main>\n"
    = "\t<fv-dialog v-model=\"yourBooleanVar\">\n"
    = "\t\t<!-- Content -->\n"
    = "\t</fv-dialog>\n"
    = "</fv-main>\n"
  doc-features(:features="features")
  doc-example
    .fv-padding
      label.fv-control-label
      .fv-form-control
        fv-button(@click="inputs.dialog = true") Click to Open Dialog
        span.fv-padding-small
        label
          | Overlay:
          span.fv-padding-small
          fv-switch(v-model="inputs.overlay")
    fv-dialog.fv-border(v-model="inputs.dialog", :overlay="inputs.overlay")
      fv-header.fv-default
        .title My name is Dialog
      fv-content
        p Pato said in an interview with the Brazilian television program Esporte Espetacular that at age 11, he broke his arm and found a tumor in the arm and feared the arm needed to be amputated. His surgery to remove the tumor was successful and did not require an amputation.
      .fv-padding-small.fv-text-end
        fv-button(@click="inputs.anotherDialog = true") Open Another Dialog
        span.fv-padding-small
        fv-button.fv-primary(@click="inputs.dialog = false", autofocus) Close
    fv-dialog.fv-border(v-model="inputs.anotherDialog", :overlay="inputs.overlay")
      fv-content
        | I Am Another Dialog And Blah Blah.
      .fv-padding-small.fv-text-end
        fv-button.fv-danger(@click="inputs.dialog = false", autofocus) Close Behind Dialog
        span.fv-padding-small
        fv-button.fv-primary(@click="inputs.anotherDialog = false") Close
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
        dialog: false,
        anotherDialog: false,
        overlay: true
      },
      features: [
        'Developer Friendly',
        'Handle Mobile Back Button',
        'Responsive',
        'Editable'
      ],
      api: {
        prop: [
          {
            name: 'value',
            type: 'Boolean',
            default: 'false',
            description: 'Visibility of dialog.'
          },
          {
            name: 'overlay',
            type: 'Boolean',
            default: 'true',
            description: 'Show overlay behind dialog.'
          },
          {
            name: 'animation',
            type: 'String',
            default: '"fv-fade"',
            description: 'Dialog opening and closing (vue) transition name.'
          }
        ],
        event: [
          {
            name: 'input',
            params: '(value)',
            description: 'Fired when dialog try to change <b>value</b> prop. If you want to show modal dialog, do not handle this, so dialog user cann\'t close dialog by clicking overlay.'
          },
          {
            name: 'open',
            params: '',
            description: 'Fired when dialog opened.'
          },
          {
            name: 'close',
            params: '',
            description: 'Fired when dialog closed.'
          }
        ]
      }
    }
  }
}
</script>
