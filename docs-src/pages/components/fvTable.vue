<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To creating fulll-featured table inside your application, use this component.
    doc-code
      = "<fv-table></fv-table>"
    doc-example
      fv-content.fv-row
        .fv-col-xs-12
          h4 Github API: (with total-count-key)
        .fv-col-xs-12
          fv-table(:fields="['id', {value: 'full_name', text: 'Name'}, 'score']",
            :limit="7",
            :ajax="axios",
            api="https://api.github.com/search/repositories?q=node&page={page}&per_page={limit}",
            api-rows-key="data.items",
            api-total-count-key="data.total_count")
        .fv-col-xs-12
          h4 Typicode API: (with formatter and without footer and limit)
        .fv-col-xs-12
          fv-table(:fields="[{value: 'username', formatter(v){ return '@'+v }}, 'name']",
            :limit="7",
            :ajax="axios",
            api="https://jsonplaceholder.typicode.com/users",
            api-rows-key="data",
            :footer="false")
        .fv-col-xs-12
          h4 Local rows without Clickable rows:
        p.fv-col-xs-12 Look at api table at bottom of page :D
    doc-api(:rows="api")
</template>

<script>
import docApi from '../../components/docApi.vue'
import docDescription from '../../components/docDescription.vue'
import docExample from '../../components/docExample.vue'
import docCode from '../../components/docCode.vue'
import axios from 'axios'

export default {
  components: {
    docApi,
    docDescription,
    docExample,
    docCode
  },
  data () {
    return {
      axios,
      api: {
        prop: [
          {
            name: 'fields',
            type: 'Array',
            default: '[]',
            description: 'List of table fields.<br>Each item in array, is object that can have<br>value:String, icon:String, text:String, class:String, width:[Number, String] and formatter:Function prop.'
          },
          {
            name: 'local',
            type: 'Boolean',
            default: 'false',
            description: 'Is it local table rows or should call api to fetch rows'
          },
          {
            name: 'ajax',
            type: '---',
            default: 'null',
            description: 'Ajax provider object, if it\'s not local.'
          },
          {
            name: 'rows',
            type: 'Array',
            default: '[]',
            description: 'List of table rows, just if it\'s local.'
          },
          {
            name: 'api',
            type: 'String',
            default: '"/items?page:{page}&limit={limit}"',
            description: 'Api url, if it\'s not local.<br>{page} and {limit} part inside api, passed by fv-table automatically.'
          },
          {
            name: 'header',
            type: 'Boolean',
            default: 'true',
            description: 'Show table header.'
          },
          {
            name: 'footer',
            type: 'Boolean',
            default: 'true',
            description: 'Show table footer.'
          },
          {
            name: 'paginate',
            type: 'Boolean',
            default: 'true',
            description: 'Doe\'s not api response return all rows alltogether?<br>If yes, it means you can use paginate to let user navigate into pages.'
          },
          {
            name: 'api-rows-key',
            type: 'Enum [String, null]',
            default: 'null',
            description: 'Rows key from api response.'
          },
          {
            name: 'api-total-count-key',
            type: 'Enum [String, null]',
            default: 'null',
            description: 'If your api response return total-count of rows key, set key into this.'
          },
          {
            name: 'api-finished-key',
            type: 'Enum [String, null]',
            default: 'null',
            description: 'If your api response return finished boolean prop, set key into this.<br>Note that you can put "!" at start of string, if your api return not-finished boolean prop.'
          },
          {
            name: 'api-next-page-key',
            type: 'Enum [String, null]',
            default: 'null',
            description: 'If your api response return next page value prop, set key into this.'
          },
          {
            name: 'api-previous-page-key',
            type: 'Enum [String, null]',
            default: 'null',
            description: 'If your api response return previous page value prop, set key into this.'
          },
          {
            name: 'clickable-rows',
            type: 'Boolean',
            default: 'true',
            description: 'Let user click on rows.'
          },
          {
            name: 'limit',
            type: 'Number',
            default: '15',
            description: 'fv-table set this to {limit} part of "api".'
          },
          {
            name: 'menu',
            type: 'Boolean',
            default: 'false',
            description: 'Allow menu button and event.'
          },
          {
            name: 'check-list',
            type: 'Boolean',
            default: 'false',
            description: 'Allow select multiple rows for menu event.'
          },
          {
            name: 'initial-state',
            type: 'Object',
            default: 'null',
            description: 'Initial state of table in api mode. You can find value by calling getState method.'
          }
        ],
        event: [
          {
            name: 'fetch',
            params: '---',
            description: 'Fired when api return response.'
          },
          {
            name: 'fetch-error',
            params: '---',
            description: 'Fired when api return error.'
          },
          {
            name: 'click-row',
            params: '(row)',
            description: 'Fired when user clicked on row.'
          },
          {
            name: 'menu',
            params: '(list-of-rows)',
            description: 'Fired when user clicked on menu button.'
          }
        ],
        method: [
          {
            name: 'fetch',
            params: '---',
            description: 'Re-fetch current state of fv-table.'
          },
          {
            name: 'getState',
            params: '---',
            description: 'Get current state of table.'
          }
        ]
      }
    }
  }
}
</script>
