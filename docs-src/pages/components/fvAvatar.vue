<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To create user avatar image element, use this. (added from 1.2.0)
    doc-code
      = "<fv-avatar></fv-avatar>"
    doc-example
      .fv-row
        .fv-col
          .fv-form-control-group.fv-text-center
            .fv-block
              fv-avatar(name="Amir Momenian", src="face-06.jpg", size="72px")
        .fv-col
          .fv-form-control-group.fv-text-center
            .fv-block
              fv-avatar.square(name="Maryam Amini", src="face-03.jpg", size="72px")
        .fv-col-12
          .fv-form-control-group.fv-text-center
            .fv-block
              fv-avatar(name="Amir Dadashi", size="72px")
            small This ones has unavailable src and the name of user is Amir Dadashi!
        .fv-col
          .fv-form-control-group.fv-text-center
            fv-avatar(name="Abbas Ghaderi", src="face-01.jpg", size="42px")
            b.fv-horizontal-padding-small Abbas Ghaderi
        .fv-col
          .fv-form-control-group.fv-text-center
            fv-avatar(name="Hasan Shamaeezade", src="face-02.jpg", size="42px")
            b.fv-horizontal-padding-small Hasan Shamaeezade
        .fv-col
          .fv-form-control-group.fv-text-center
            fv-avatar(name="Without Src", size="42px")
            b.fv-horizontal-padding-small Without Src
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
