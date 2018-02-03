<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To creating slider element, use this component. Note that before using this, you can add
      =" "
      a.fv-link(href="http://hammerjs.github.io/", target="_blank") HammerJs
      |  as dependency of framevuerk to allow touch actions. This component make every slots in body to slider item.
    doc-code(title="Javascript:", lang="javascript")
      = "import framevuerk from 'framevuerk'\n"
      = "import Hammer from 'hammerjs'\n"
      = "framevuerk.use('hammer', Hammer)\n"
    doc-code
      = "<fv-slider></fv-slider>"
    doc-example
      .fv-padding
        h4 Default:
        fv-slider(:show-tabs="false", :show-navs="true", :show-buttons="true", :per-slide="1", v-model="items.s1")
          fv-content.fv-text-center.fv-no-padding(slot="A")
            fieldset.fv-form-control-group
              h2 1: Slide A
              p Hi. This is blah blah blah.
              br
          fv-content.fv-text-center.fv-no-padding(slot="B")
            fieldset.fv-form-control-group
              h2 2: Slide B
              p Hi. This is fooooo.
              br
        br
        h4 With Tabs And Custom Template for Tab-Buttons:
        fv-slider(:show-tabs="true", :show-navs="false", :show-buttons="false", :per-slide="2", v-model="items.s2")
          template(slot-scope="scope", slot="button")
            b
              i.fa.fa-google-plus
              =" "
              small {{scope.value}}
          .fv-row.fv-text-center.fv-no-padding(slot="A")
            .fv-col-xs-6
              fieldset.fv-form-control-group
                h2 Slide A
                p Blahhhhh.
            .fv-col-xs-6
              fieldset.fv-form-control-group
                h2 Slide A2
                p Fooooo.
          .fv-row.fv-text-center.fv-no-padding(slot="B")
            .fv-col-xs-6
              fieldset.fv-form-control-group
                h2 Slide B
                p Ahhhhh.
            .fv-col-xs-6
              fieldset.fv-form-control-group
                h2 Slide B2
                p Hahahaha.
          .fv-row.fv-text-center.fv-no-padding(slot="C")
            .fv-col-xs-12
              fieldset.fv-form-control-group
                h2 Slide C
                p I`m C.
        br
        h4 With interval:
        fv-slider(:show-tabs="false", :show-navs="false", :show-buttons="false", :per-slide="3", :interval="3000", v-model="items.s3")
          fv-content.fv-text-center.fvz-no-padding(slot="A")
            fieldset.fv-form-control-group
              h2 A
              p Blah.
          fv-content.fv-text-center.fvz-no-padding(slot="B")
            fieldset.fv-form-control-group
              h2 B
              p Foo.
          fv-content.fv-text-center.fvz-no-padding(slot="C")
            fieldset.fv-form-control-group
              h2 C
              p Bar.
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
      items: {
        s1: '',
        s2: '',
        s3: ''
      },
      api: {
        prop: [
          {
            name: 'value',
            type: 'String',
            default: '',
            description: 'Selected slot.'
          },
          {
            name: 'show-tabs',
            type: 'Boolean',
            default: 'true',
            description: 'Show tab on top of slider.'
          },
          {
            name: 'show-buttons',
            type: 'Boolean',
            default: 'false',
            description: 'Show next and prev buttons on slider.'
          },
          {
            name: 'show-navs',
            type: 'Boolean',
            default: 'false',
            description: 'Show nav at bottom of slider.'
          },
          {
            name: 'interval',
            type: 'Number',
            default: '0',
            description: 'Interval time of auto slide. If zero or slots length < 2, it\'s not affect.'
          }
        ]
      }
    }
  }
}
</script>
