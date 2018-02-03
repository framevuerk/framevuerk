<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To creating image(s) element, use this component. Note that before using this, you can add
      =" "
      a.fv-link(href="http://hammerjs.github.io/", target="_blank") HammerJs
      =" "
      |  as dependency of framevuerk to allow touch actions.
    doc-code(title="Javascript:", lang="javascript")
      = "import framevuerk from 'framevuerk'\n"
      = "import Hammer from 'hammerjs'\n"
      = "framevuerk.use('hammer', Hammer)\n"
    doc-code
      = "<fv-img></fv-img>"
    doc-example
      .fv-padding
        h4 Default Single Src:
        fv-img(src="01.jpg")
        br
        h4 Multiple src:
        fv-img(:src="['06.jpg', '07.jpg', '08.jpg']")
    doc-api(:rows="api")
</template>

<script>
import docApi from '../../components/docApi.vue'
import docDescription from '../../components/docDescription.vue'
import docExample from '../../components/docExample.vue'
import docCode from '../../components/docCode.vue'
// images
import '../../assets/images/01.jpg'
import '../../assets/images/02.jpg'
import '../../assets/images/03.jpg'
import '../../assets/images/04.jpg'
import '../../assets/images/05.jpg'
import '../../assets/images/06.jpg'
import '../../assets/images/07.jpg'
import '../../assets/images/08.jpg'
import '../../assets/images/09.jpg'

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
            type: '[String, Array]',
            default: '',
            description: 'Source of image(s).<br>If it\'s string, src is just like normal img tag.<br>But if Array, you can put Array of src.'
          },
          {
            name: 'show-buttons',
            type: 'Boolean',
            default: 'false',
            description: 'Show next and prev buttons if available.'
          },
          {
            name: 'interval',
            type: 'Number',
            default: '0',
            description: 'Interval time of auto slide. If zero or src length < 2, it\'s not affect.'
          }
        ]
      }
    }
  }
}
</script>
