<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To creating fulll-featured list inside your application, use this component.
    doc-code
      = "<fv-list>\n"
      = "\t<fv-list-item>Item</fv-list-item>\n"
      = "</fv-list>"
    doc-example
      fv-content.fv-row
        .fv-col-xs-12
          h4 Default:
        .fv-col-xs-12
          fv-list(parent)
            fv-list-item One
            fv-list-item Two
            fv-list-item(disabled) Three
            fv-list-item Four
            fv-list-item(selected) Five
        .fv-col-xs-12
          h4 With Sub-List
        .fv-col-xs-12
          fv-list
            fv-list-item.unclickable Salam
            fv-list-item.unclickable Chetori?
            fv-list-item.unclickable(expanded)
              | Khubi?
              fv-list(slot="sub-list")
                fv-list-item.unclickable Che Khabar?
                fv-list-item.unclickable
                  | Amme ina khuban?
                  fv-list(slot="sub-list")
                    fv-list-item.unclickable Pesar Amuha?
                    fv-list-item.unclickable Dige che khabar?
    doc-api(:rows="listApi", title="List API")
    doc-api(:rows="listItemApi", title="ListItem API")
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
      listApi: {
        prop: [
          {
            name: 'parent',
            type: 'Boolean',
            default: 'false',
            description: 'Set it true to calculate highlighted.'
          },
          {
            name: 'not-found-text',
            type: '',
            default: 'locale.notFoundText()',
            description: 'If list items is empty, show this text.'
          }
        ],
        event: [],
        method: []
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
            params: '---',
            description: 'Fired when user click on item.'
          },
          {
            name: 'collapse',
            params: '---',
            description: 'Fired when \'sub-list\' slot collapsed.'
          },
          {
            name: 'expand',
            params: '---',
            description: 'Fired when api \'sub-list\' slot expanded.'
          }
        ],
        method: [
          {
            name: 'collapse',
            params: '---',
            description: 'Collapse \'sub-list\' slot.'
          },
          {
            name: 'expand',
            params: '---',
            description: 'Expand \'sub-list\' slot.'
          },
          {
            name: 'toggle',
            params: '---',
            description: 'Collapse/Expand \'sub-list\' slot'
          }
        ]
      }
    }
  }
}
</script>
