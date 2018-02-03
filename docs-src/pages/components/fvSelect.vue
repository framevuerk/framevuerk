<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To create full featured select (dropdown) in your application, use this!
    doc-code
      = "<fv-select></fv-select>"
    doc-example
      .fv-row
        .fv-col-xs-12
          h4 Usage:
        .fv-col-sm-6
          p Default:
          fv-select(v-model="inputs.d1", :search="false", placeholder="Select your country", :options="[{text: 'Iran', value: 'ir'}, {text: 'Germany', value: 'ger'}]")
        .fv-col-sm-6
          p Custom Template:
          fv-select(v-model="inputs.d6", :search="false", placeholder="Select your name!", :options="[{text: 'Maryam', value: 'mar', icon: 'fa fa-git'}, {text: 'Amir', value: 'amir', icon: 'fa fa-linux'}, {text: 'Javad', value: 'javad', icon: 'fa fa-google-plus'}, {text: 'Daryoush', value: 'darush', icon: 'fa fa-spinner fa-spin'}]")
            template(slot-scope="scope")
              br
              h4
                i(:class="scope.option.icon")
                =" "
                span(v-html="scope.option.text")
              p Value is: {{scope.option.value}}
              br
        .fv-col-sm-6
          p Multiple:
          fv-select(v-model="inputs.d2", multiple, placeholder="Select your favorite Club", :options="[{text: 'A.C. Milan', value: 'milan'}, {text: 'Real Madrid', value: 'real'}, {text: 'Esteghlal', value: 'esteghlal'}]")
        .fv-col-sm-6
          p Allow insert:
          fv-select(v-model="inputs.d3", search, multiple, allow-insert, placeholder="Select your favorite countries", value-key="", text-key="", disabled-key="", :options.sync="d3opts")
        .fv-col-sm-6
          p Disabled:
          fv-select(v-model="inputs.d4", disabled, placeholder="You can't select me!")
        .fv-col-sm-6
          p Advanced Required:
          fv-select(v-model="inputs.d5", :search="false", multiple, placeholder="Select 3 items!", :required="function(){ return this.value.length === 3 }", :options="[{text: 'Silva', value: 'silva'}, {text: 'Ronaldinho', value: 'ronaldinho'}, {text: 'Ronaldo', value: 'ronaldo'}, {text: 'Pato', value: 'pato'}, {text: 'Hulk', value: 'hulk', disabled: true}]")
        .fv-col-sm-6
          p Loading...:
          fv-select(placeholder="Select me!", :options=['Pato', 'Robinho', 'Ronaldinho', 'Ronaldo', 'Roberto Carlos'], loading)

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
        d1: undefined,
        d2: undefined,
        d3: [],
        d4: undefined,
        d5: [],
        d6: undefined
      },
      d3opts: ['USA', 'USB', 'USC'],
      api: {
        prop: [
          {
            name: 'value || v-model (required)',
            type: '---',
            default: 'undefined',
            description: 'Value of select'
          },
          {
            name: 'input-class',
            type: '---',
            default: '""',
            description: 'Class attr of fv-input'
          },
          {
            name: 'dialog-class',
            type: '---',
            default: '""',
            description: 'Class attr of fv-dialog'
          },
          {
            name: 'required',
            type: '[Boolean, Function]',
            default: 'false',
            description: 'Just like normal select required attribute. Also you can pass a function to check validity of value as you want.'
          },
          {
            name: 'disabled',
            type: 'Boolean',
            default: 'false',
            description: 'Just like normal select disabled attribute'
          },
          {
            name: 'search',
            type: 'Enum [null, true, false]',
            default: 'true',
            description: 'Allow user to search in options. If it is null, search input will show, but does not affect to the list.'
          },
          {
            name: 'placeholder',
            type: 'String',
            default: '""',
            description: 'Just like normal select placeholder attribute'
          },
          {
            name: 'multiple',
            type: 'Boolean',
            default: 'false',
            description: 'Allow user to select multiple options'
          },
          {
            name: 'allow-insert',
            type: 'Boolean',
            default: 'false',
            description: 'Allow user to insert option to options. Note that you should pass options as variable and add .sync modifier to options prop to using this.'
          },
          {
            name: 'loading',
            type: 'Boolean',
            default: 'false',
            description: 'Show loading spinner instead of list'
          },
          {
            name: 'options',
            type: 'Array',
            default: '[]',
            description: 'List of options in select.'
          },
          {
            name: 'valueKey',
            type: 'String',
            default: '"value"',
            description: 'Value key in each object in options.'
          },
          {
            name: 'textKey',
            type: 'String',
            default: '"text"',
            description: 'Text key in each object in options.'
          },
          {
            name: 'disabledKey',
            type: 'String',
            default: '"disabled"',
            description: 'Disabled key in each object in options.'
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
            name: 'update:options',
            params: '---',
            description: 'Fired when user insrted new option.'
          },
          {
            name: 'search',
            params: '(search-query)',
            description: 'Fired when search query changed'
          }
        ],
        method: [
          {
            name: 'open',
            params: '---',
            description: 'Open dialog'
          },
          {
            name: 'close',
            params: '---',
            description: 'Close dialog'
          }
        ]
      }
    }
  }
}
</script>
