<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To create full featured menu in your application, use this!
    doc-code
      = "<fv-menu></fv-menu>"
    doc-example
      fv-menu(ref="m1", :items="['Item 1', 'Item 2','Item 3']", text-key="", disabled-key="", @item-click="doIt")
      fv-menu(ref="m2", :sheet="true", :items="[{text: 'Copy', disabled: false}, {text: 'Cut', disabled: false}, {text: 'Paste', disabled: true}]", @item-click="doIt")
      fv-menu(ref="m3", :sheet="null", :items="[{text: 'Google', icon: 'fa fa-google'}, {text: 'Yahoo', icon: 'fa fa-yahoo'}, {text: 'Microsoft', icon: 'fa fa-windows'}]", title="Select your favorite company", @item-click="doIt")
        template(slot-scope="scope")
          i(:class="scope.item.icon")
          |  {{scope.item.text}}
          | : {{scope.userArgument}}
      fv-content.fv-row
        h4 Normal
        fv-button.fv-default(@click="$refs.m1.open($event)", icon="fa fa-ellipsis-v")
        br
        h4 With disabled item
        fv-button.fv-default(@click="$refs.m2.open($event)", icon="fa fa-ellipsis-v")
        br
        h4 Custom Template + User Argument
        .fv-input-group.fv-flex
          fv-input.fv-grow(placeholder="Enter Argument", v-model="inputs.d1")
          fv-button.fv-ok(@click="$refs.m3.open($event, inputs.d1)", icon="fa fa-ellipsis-v")
        .fv-col-12
          br
        .fv-col-12
          br
        .fv-col-12
          br
        .fv-col-12
          br
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
            description: 'Title of dialog'
          },
          {
            name: 'auto-close',
            type: 'Boolean',
            default: 'true',
            description: 'Close dialog by clicking buttons'
          },
          {
            name: 'items',
            type: 'Array',
            default: '[]',
            description: 'List of items in menu.'
          },
          {
            name: 'textKey',
            type: 'String',
            default: '"text"',
            description: 'Text key in each object in items.'
          },
          {
            name: 'disabledKey',
            type: 'String',
            default: '"disabled"',
            description: 'Disabled key in each object in items.'
          }
        ],
        event: [
          {
            name: 'open',
            params: '---',
            description: 'Fired when dialog opened'
          },
          {
            name: 'close',
            params: '---',
            description: 'Fired when dialog closed'
          },
          {
            name: 'item-click',
            params: '(item, user-argument)',
            description: 'Fired when user click on item.'
          }
        ],
        method: [
          {
            name: 'open',
            params: '(event, user-argument)',
            description: 'Open menu.<br>For calculating menu position you should pass event variable accessed on click event and the optional user-argument can be accessed on click-item event and in custom template.'
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
  },
  methods: {
    doIt (a, b) {
      this.$fvToast.show(`You clicked on ${typeof a === 'string' ? a : a.text}${b ? ` and user-argument is ${b}` : ''}`)
    }
  }
}
</script>
