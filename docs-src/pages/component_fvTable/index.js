import template from './template.pug'
import docApi from '../../components/docApi'
import docDescription from '../../components/docDescription'
import docExample from '../../components/docExample'
import docCode from '../../components/docCode'
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
            description: 'List of table fields.<br>Each item in array, is object that can have<br>value:String, icon:String, text:String, class:String and formatter:Function prop.'
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
            name: 'footer',
            type: 'Boolean',
            default: 'true',
            description: 'Show footer next to table.'
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
          }
        ],
        method: [
          {
            name: 'fetch',
            params: '---',
            description: 'Re-fetch current state of fv-table.'
          }
        ]
      }
    }
  },
  render: template.render
}
