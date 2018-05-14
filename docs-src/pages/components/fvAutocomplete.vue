<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To create full featured autocomplete and tags input in your application, use this! (added from 1.1.0) (will remove in 2.x.y. use fv-select instead)
    doc-code
      = "<fv-autocomplete></fv-autocomplete>"
    doc-example
      .fv-row
        .fv-col-12
          p Normal (Tags input)
          fv-autocomplete(v-model="inputs.d1", placeholder="Select post tags" :suggestions="['php', 'golang', 'javascript', 'python', 'vb6']",)
        .fv-col-12
          p Single (Autocomplete)
          fv-autocomplete(v-model="inputs.d2", placeholder="Single your city", :suggestions="['tehran', 'rasht', 'qazvin']", :multiple="false")
        .fv-col-12
          p Custom usage (use API to fetch suggestions)
          fv-autocomplete(v-model="inputs.d3", placeholder="Select you favorite team", :suggestions="d3sugs", value-key="txt", text-key="txt", :allow-insert="false", :loading="d3loading", :search="null", @search="d3search")
            template(slot="suggestion", slot-scope="scope")
              h2 {{scope.suggestion.txt}}
              p {{scope.suggestion.description}}
            template(slot="value", slot-scope="scope")
              i.fa.fa-check
              =" "
              p.fv-inline {{scope.suggestion.txt}}
        .fv-col-12
          p Disabled
          fv-autocomplete(v-model="inputs.d4", disabled, placeholder="Tags", :suggestions="['amir', 'hasan', 'javascript']", multiple, :search="null", @search="d3search")
      br
      br
      br
      br
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
        d1: [],
        d2: undefined,
        d3: []
      },
      d3sugs: [],
      d3loading: false,
      d3timeout: null,
      api: {
        prop: [
          {
            name: 'value (required)',
            type: '',
            default: 'undefined',
            description: 'Value of input'
          },
          {
            name: 'required',
            type: '[Boolean, Function]',
            default: 'false',
            description: 'Just like normal input required attribute. Also you can pass a function to check validity of value as you want.'
          },
          {
            name: 'disabled',
            type: 'Boolean',
            default: 'false',
            description: 'Just like normal input disabled attribute'
          },
          {
            name: 'placeholder',
            type: 'String',
            default: '""',
            description: 'Just like normal input placeholder attribute'
          },
          {
            name: 'loading',
            type: 'Boolean',
            default: 'false',
            description: 'Show loading spinner instead of suggestions list'
          },
          {
            name: 'suggestions',
            type: 'Array',
            default: '[]',
            description: 'List of default suggestions.'
          },
          {
            name: 'multiple',
            type: 'Boolean',
            default: 'false',
            description: 'Allow user to add multiple items'
          },
          {
            name: 'allow-insert',
            type: 'Boolean',
            default: 'false',
            description: 'Allow user to insert custom item that is not in suggestions list.'
          },
          {
            name: 'search',
            type: 'Enum [null, true, false]',
            default: 'true',
            description: 'Allow user to search in suggestions. If it is null, search input will show, but does not affect to the list.'
          }
        ],
        event: [
          {
            name: 'insert-suggestion',
            params: '(suggestion)',
            description: 'Fired when new suggestion inserted'
          }
        ],
        scopedSlots: [{
          name: 'default',
          params: '(suggestion)',
          description: 'suggestion in list'
        }],
        scopedSlot: [
          {
            name: 'value',
            params: '(value, suggestion)',
            description: 'value item in input box'
          },
          {
            name: 'suggestion',
            params: '(suggestion)',
            description: 'suggestion in list'
          }
        ]
      }
    }
  },
  methods: {
    d3search (txt) {
      clearTimeout(this.d3timeout)
      this.d3loading = true
      this.d3timeout = setTimeout(() => {
        this.d3sugs = [
          {
            txt: `${txt}blah`,
            description: 'blah blah'
          },
          {
            txt: `${txt}foo`,
            description: 'a foooo'
          },
          {
            txt: `bar${txt}`,
            description: 'bar di baaaraa'
          }
        ]
        this.d3loading = false
      }, 1000)
    }
  }
}
</script>
