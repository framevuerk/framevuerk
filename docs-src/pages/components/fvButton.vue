<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To create button in your application, use this!
    doc-code
      = "<fv-button></fv-button>"
    doc-example
      .fv-row
        .fv-col-xs-12
          h4 Themes:
        .fv-col-sm-4
          fv-button.fv-block(icon="fa fa-check") Default
        .fv-col-sm-4
          fv-button.fv-primary.fv-block(icon="fa fa-check") Primary
        .fv-col-sm-4
          fv-button.fv-danger.fv-block(icon="fa fa-trash") Danger
        .fv-col-sm-4
          fv-button.fv-warning.fv-block(icon="fa fa-warning") Warning
        .fv-col-sm-4
          fv-button.fv-info.fv-block(icon="fa fa-info") Info
      .fv-row
        .fv-col-xs-12
          h4 Sizes:
        .fv-col-sm-4
          fv-button.fv-xl.fv-block(icon="fa fa-check") XL
        .fv-col-sm-4
          fv-button.fv-lg.fv-block(icon="fa fa-check") LG
        .fv-col-sm-4
          fv-button.fv-md.fv-block(icon="fa fa-check") MD
        .fv-col-sm-4
          fv-button.fv-sm.fv-block(icon="fa fa-check") SM
        .fv-col-sm-4
          fv-button.fv-xs.fv-block(icon="fa fa-check") XS
      .fv-row
        .fv-col-xs-12
          h4 States:
        .fv-col-sm-6
          p Disabled
          fv-button.fv-block(disabled, icon="fa fa-check") Disabled
        .fv-col-sm-6
          p Ivalid
          fv-button.fv-block(disabled, icon="fa fa-check", invalid) [Invalid]
        .fv-col-sm-6
          p Loading
          fv-button.fv-block(loading, icon="fa fa-check")
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
            name: 'loading',
            type: 'Boolean',
            default: 'false',
            description: 'Show loading spinner instead of content'
          },
          {
            name: 'icon',
            type: '',
            default: '""',
            description: 'Icon of button'
          },
          {
            name: 'text',
            type: '',
            default: '',
            description: 'Text of button (also you can use slot like normal buttons)'
          },
          {
            name: 'disabled',
            type: 'Boolean',
            default: 'false',
            description: 'Just like normal button disabled prop'
          }
        ],
        event: [
          {
            name: 'click',
            params: 'event',
            description: 'Fired when user clicked on button and both disabled and loading props are false.'
          }
        ],
        method: []
      }
    }
  }
}

</script>
