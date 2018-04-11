<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To create user avatar image element, use this. (added from 1.2.0)
    doc-code
      = "<fv-avatar></fv-avatar>"
    doc-example
      .fv-row
        .fv-col-xs-12
          h4 Usage:
        .fv-col-sm-6
          p If src image is available:
          fv-avatar(name="Amir Momenian", src="face-06.jpg", size="64px")
          =" "
          fv-avatar(name="Maryam Amini", src="face-03.jpg", size="48px")
          =" "
          fv-avatar(name="Mitra Bahreman", src="face-05.jpg", size="32px")
        .fv-col-sm-6
          p Same elements, without src:
          fv-avatar(name="Amir Momenian", size="64px")
          =" "
          fv-avatar(name="Maryam Amini", size="48px")
          =" "
          fv-avatar(name="Mitra Bahreman", size="32px")
    doc-api(:rows="api")
</template>

<script>
import docApi from '../../components/docApi.vue'
import docDescription from '../../components/docDescription.vue'
import docExample from '../../components/docExample.vue'
import docCode from '../../components/docCode.vue'
import '../../assets/images/face-03.jpg'
import '../../assets/images/face-05.jpg'
import '../../assets/images/face-06.jpg'

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
            name: 'src',
            type: 'String',
            default: 'undefined',
            description: 'Source of image'
          },
          {
            name: 'name',
            type: 'String',
            default: 'undefined',
            description: 'Name of user. Just used if src not available.'
          },
          {
            name: 'size',
            type: '',
            default: '"32px"',
            description: 'Size of avatar. This will set as width and height of element.'
          }
        ]
      }
    }
  }
}
</script>
