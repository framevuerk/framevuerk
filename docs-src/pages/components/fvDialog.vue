<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To create full featured dialog in your application, use this!
    doc-code
      = "<fv-dialog>\n"
      = "\t<!-- contents -->\n"
      = "</fv-dialog>\n"
    doc-example
      fv-dialog(ref="d1", position="center", :buttons="[{class: 'fv-ok',icon: 'fa fa-check',text: 'OK'}]", content="This is simple dialog. not?", title="Simple")
      fv-dialog(ref="d2", content-class="fv-text-center", position="center", :auto-close="false", :modal="true")
        fv-content.fv-text-center
          fv-button.fv-ok.fv-xl(:style="{borderRadius: '100px', width: '100px', height: '100px'}", @click.native="$refs.d2.close()") OK
      fv-dialog(ref="d3", position="bottom")
        fv-content
          .fv-pull-left I can also show like a sheet.
          .fv-pull-right
            fv-button.fv-xs(@click="$refs.d3.close()", icon="fa fa-check") OK
      fv-dialog(ref="d5", position="top")
        fv-content
          .fv-pull-left I can also show like a sheet at top.
          .fv-pull-right
            fv-button.fv-xs(@click="$refs.d5.close()", icon="fa fa-check") OK
      fv-dialog(ref="d4", position="fill", :buttons="[{class: 'fv-ok',icon: 'fa fa-check',text: 'OK'}]", content="This is fill dialog.", title="Fill")
      fv-content.fv-row
        fv-button.fv-block.fv-ok(@click.native="$refs.d1.open()") Simple
        br
        fv-button.fv-block.fv-primary(@click.native="$refs.d2.open()") Modal, Without built-in Buttons
        br
        fv-button.fv-block.fv-danger(@click.native="$refs.d3.open()") Modified Style at Bottom
        br
        fv-button.fv-block.fv-info(@click.native="$refs.d5.open()") or Top ;)
        br
        fv-button.fv-block(@click.native="$refs.d4.open()") Fill
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
            name: 'title',
            type: 'String',
            default: '""',
            description: 'Title of dialog (if it\'s empty, title container not rendered'
          },
          {
            name: 'content',
            type: 'String',
            default: '""',
            description: 'Content of dialog (if it\'s empty, content container not rendered'
          },
          {
            name: 'position',
            type: 'Enum ["bottom", "top", "center", "fill", "x-y"]',
            default: '"center"',
            description: 'Position of dialog.<br>Note that "x-y" value means that if parent main size is small, use Y instead of X.'
          },
          {
            name: 'autoClose',
            type: 'Boolean',
            default: 'true',
            description: 'Close dialog by clicking buttons'
          },
          {
            name: 'modal',
            type: 'Boolean',
            default: 'false',
            description: 'Close dialog by clicking overlay or by ESC key'
          },
          {
            name: 'buttons',
            type: 'Array',
            default: '[]',
            description: 'Buttons of dialog.<br>Each item in array, directly bind to fvButton component, so it should be an Object with fvButton props and values.'
          },
          {
            name: 'first-focus-on',
            type: 'Boolean or Number',
            default: '""',
            description: 'First focus target element of dialog.<br>If it\'s true, first focusable element will give focus.<br>If it\'s false, last focusable element will give focus!<br>Else if that\'s Number, fv-dialog use this as index of element to be focused.'
          }
        ],
        event: [
          {
            name: 'open',
            params: '(user-argument)',
            description: 'Fired when dialog opened'
          },
          {
            name: 'close',
            params: '(user-argument)',
            description: 'Fired when dialog closed'
          },
          {
            name: 'button-click',
            params: '(button, user-argument)',
            description: 'Fired when dialog buttons clicked'
          }
        ],
        method: [
          {
            name: 'open',
            params: '(user-argument)',
            description: 'Open dialog.<br>The optional argument can be accessed on click-button event.'
          },
          {
            name: 'close',
            params: '---',
            description: 'Close dialog'
          },
          {
            name: 'toggle',
            params: '---',
            description: 'Toggle dialog'
          }
        ]
      }
    }
  }
}
</script>
