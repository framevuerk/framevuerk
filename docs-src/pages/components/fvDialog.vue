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
      fv-dialog.fv-col-xs-10.fv-col-md-8.fv-col-lg-6(ref="d1", :buttons="[{icon: 'fa fa-check',text: 'Cancel'}, {class: 'fv-primary', icon: 'fa fa-check',text: 'OK'}]", content="This is simple dialog. And this is content of dialog. so can you go and come?", title="Simple")
      fv-dialog.fv-col-xs-10.fv-col-md-8.fv-col-lg-6(ref="d15", :overlay="false", :buttons="[{icon: 'fa fa-check',text: 'Cancel'}, {class: 'fv-primary', icon: 'fa fa-check',text: 'OK'}]", content="This is simple dialog. And this is content of dialog. so can you go and come?", title="Simple")
      fv-dialog(ref="d2", :auto-close="false", :modal="true")
        fv-content.fv-text-center
          fv-button.fv-ok.fv-xl(:style="{borderRadius: '100px', width: '100px', height: '100px'}", @click.native="$refs.d2.close()") OK
      fv-dialog(ref="d3", :auto-close="false", @close="$root.log", modal)
        template(slot-scope="scope")
          fv-content
            | Hi, My name is Beem And User Arg Is
            =" "
            b {{scope.param}}
          .fv-padding-small.fv-text-end
            fv-button(@click="$refs.d2.open()") Open D2
            fv-button.fv-block(@click="$refs.d3.close()", icon="fa fa-check") OK
      fv-content.fv-row
        fv-button(@click="$refs.d1.open()") Simple
        br
        fv-button(@click="$refs.d15.open()") Simple No Overlay
        br
        fv-button(@click="$refs.d2.open()") Modal, Without built-in Buttons
        br
        h4 Custom Template + User Argument
        .fv-input-group.fv-flex
          fv-input.fv-grow(placeholder="Enter Argument", v-model="inputs.d1")
          fv-button(@click="$refs.d3.open(inputs.d1)") Open
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
        d1: 'X Arg'
      },
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
            name: 'left',
            type: '',
            default: 'null',
            description: 'Left position of dialog.<br>Note that for better result on non `null` value, you better pass this by variable and add .sync modifier.'
          },
          {
            name: 'top',
            type: '',
            default: 'null',
            description: 'Top position of dialog.<br>Note that for better result on non `null` value, you better pass this by variable and add .sync modifier.'
          },
          {
            name: 'width',
            type: '',
            default: '"auto"',
            description: 'Width of dialog.'
          },
          {
            name: 'height',
            type: '',
            default: '"auto"',
            description: 'Height of dialog.'
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
            params: '',
            description: 'Close dialog'
          },
          {
            name: 'toggle',
            params: '',
            description: 'Toggle dialog'
          }
        ]
      }
    }
  }
}
</script>
