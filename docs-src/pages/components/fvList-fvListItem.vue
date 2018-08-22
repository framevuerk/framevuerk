<template lang="pug">
  div
    doc-description
      | To creating full-featured list inside your application, use this component.
    doc-code
      = "<fv-list parent>\n"
      = "\t<fv-list-item>Item One</fv-list-item>\n"
      = "\t<fv-list-item expanded>\n"
      = "\t\tItem Two\n"
      = "\t\t<fv-list slot=\"sub-list\">\n"
      = "\t\t\t<fv-list-item>Sub Item</fv-list-item>\n"
      = "\t\t</fv-list>\n"
      = "\t</fv-list-item>\n"
      = "</fv-list>"
    doc-features(:features="features")
    doc-example
      fv-content.fv-row
        .fv-col-xs-12
          h4 Default:
        .fv-col-xs-12
          fv-list(parent)
            fv-list-item One
            fv-list-item Two
            fv-list-item(disabled) Three (disabled)
            fv-list-item Four
            fv-list-item(selected) Five (selected)
        .fv-col-xs-12
          h4 With Sub-List and .unclickable class.
        .fv-col-xs-12
          fv-list
            fv-list-item.unclickable One
            fv-list-item.unclickable Two
            fv-list-item.unclickable(expanded)
              | Tree
              fv-list(slot="sub-list")
                fv-list-item.unclickable Child of Tree
                fv-list-item.unclickable
                  | Another Child of Tree
                  fv-list(slot="sub-list")
                    fv-list-item.unclickable Child of Another Child of Tree
                    fv-list-item.unclickable Another Child of Another Child of Tree
    doc-api(:rows="listApi", title="fvList API")
    doc-api(:rows="listItemApi", title="fvListItem API")
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
      features: [
        'Editable',
        'Focusable',
        'Keyboard Navigation Support'
      ],
      listApi: {
        prop: [
          {
            name: 'parent',
            type: 'Boolean',
            default: 'false',
            description: 'Set it true to calculate highlighted <b>fv-list-item</b> childs and keyboard navigations.'
          },
          {
            name: 'not-found-text',
            type: '',
            default: 'Based on locale field in user config.',
            description: 'If list items is empty, show this text.'
          }
        ]
      },
      listItemApi: {
        prop: [
          {
            name: 'disabled',
            type: 'Boolean',
            default: 'false',
            description: 'If disabled, item cannot be clicked or selected by user.'
          },
          {
            name: 'selected',
            type: 'Boolean',
            default: 'false',
            description: 'Set selected style to item.'
          },
          {
            name: 'expanded',
            type: 'Boolean',
            default: 'false',
            description: 'If item has \'sub-list\' slot in body, expand it by default.'
          }
        ],
        event: [
          {
            name: 'click',
            params: '',
            description: 'Fired when user click on item.'
          },
          {
            name: 'collapse',
            params: '',
            description: 'Fired when \'sub-list\' slot collapsed.'
          },
          {
            name: 'expand',
            params: '',
            description: 'Fired when api \'sub-list\' slot expanded.'
          }
        ],
        slot: [
          {
            name: 'sub-list',
            params: '',
            description: 'If current list-item has sub-list, put <b>fv-list</b> with this slot name as child in template.'
          }
        ]
      }
    }
  }
}
</script>
