<template lang="pug">
  div
    doc-description
      | To create full featured menu in your application, use this!
    doc-code
      = "<fv-main>\n"
      = "\t<fv-menu v-model=\"yourBooleanVar\" :items=\"[{text: 'Item 1'}, {text: 'Item 2'}]\"></fv-menu>\n"
      = "</fv-main>\n"
    doc-features(:features="features")
    doc-example
      fv-menu(v-model="inputs.d1",
        :source-element="inputs.e1",
        :items="[{text: 'Copy as JSON', icon: require('../../../src/icons/feather/copy.svg')}, {text: 'Send Poke', icon: require('../../../src/icons/feather/thumbs-up.svg')}, {text: 'Call', icon: require('../../../src/icons/feather/phone-call.svg')}, {text: 'Add to Users', icon: require('../../../src/icons/feather/user-plus.svg'), disabled: true}]",
        title="Select your favorite company",
        @click="inputs.clicked = $event")
        template(slot-scope="scope")
          span.fv-vertical-middle.fv-margin-end(v-html="scope.item.icon", :style="{fontSize: '2em'}")
          span.fv-padding-small
          span {{scope.item.text}}
      fv-content
        fv-button.fv-default(@click="inputs.d1 = true; inputs.e1 = $event.target;") Click to Open Menu
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
        d1: false,
        e1: null,
        clicked: null
      },
      features: [
        'Developer Friendly',
        'Handle Mobile Back Button',
        'Responsive',
        'Editable',
        'Keyboard Navigation Support'
      ],
      api: {
        prop: [
          {
            name: 'value',
            type: 'Boolean',
            default: 'false',
            description: 'Visibility of menu.'
          },
          {
            name: 'source-element',
            type: '',
            default: 'null',
            description: 'Element that try to open menu. <b>fvMenu</b> use this to calculate menu position. You can pass <b>$event.target</b> inside <b>@click</b> event of element that try to open the menu.'
          },
          {
            name: 'items',
            type: 'Array',
            default: '[]',
            description: 'List of menu items.'
          },
          {
            name: 'text-key',
            type: 'String',
            default: '"text"',
            description: 'If type of menu <b>items</b> is array of object, pass the <b>text</b> key in each object. If it\'s array of anythings, put empty string.'
          },
          {
            name: 'disabled-key',
            type: 'String',
            default: '"disabled"',
            description: 'If type of menu <b>items</b> is array of object, pass the <b>disabled</b> key in each object. If it\'s array of anythings or non of <b>items</b> is disabled, put empty string.'
          }
        ],
        event: [
          {
            name: 'input',
            params: '(value)',
            description: 'Fired when menu try to change <b>value</b> prop. If you want to manually close the menu, do not handle this, so menu component cann\'t close self by clicking overlay or items.'
          },
          {
            name: 'click',
            params: '(item)',
            description: 'Fired when user click on menu <b>items</b>.'
          },
          {
            name: 'open',
            params: '',
            description: 'Fired when menu opened.'
          },
          {
            name: 'close',
            params: '',
            description: 'Fired when menu closed.'
          }
        ],
        scopedSlot: [
          {
            name: 'default',
            params: '(item)',
            description: 'Template of each item appear in menu.'
          }
        ]
      }
    }
  }
}
</script>
