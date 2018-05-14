<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To create full featured select (dropdown) in your application, use this! (will remove in 2.x.y. use fv-select2 instead)
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
          fv-select(v-model="inputs.d6", :search="false", placeholder="Select your name!", :options="d6opts", :delete-button="false")
            template(slot="option", slot-scope="scope")
              fv-avatar.avatar(:src="scope.option.avatar", size="46px")
              .name
                h4 {{scope.option.text}}
                small The `value` is {{scope.option.value}}
            template(slot="value", slot-scope="scope")
              // scope.value and scope.option
              fv-avatar.avatar.mini(:src="scope.option.avatar", size="20px")
              span.name(v-html="scope.option.text")
        .fv-col-sm-6
          p Multiple:
          fv-select(v-model="inputs.d2", multiple, placeholder="Select your favorite Club", :options="[{text: 'A.C. Milan', value: 'milan'}, {text: 'Real Madrid', value: 'real'}, {text: 'Esteghlal', value: 'esteghlal'}]")
        .fv-col-sm-6
          p Allow insert:
          fv-select(v-model="inputs.d3", search, multiple, allow-insert, placeholder="Select your favorite countries", value-key="", text-key="", disabled-key="", :options="d3opts", @insert="inputs.d3.push($event)")
        .fv-col-sm-6
          p Disabled:
          fv-select(v-model="inputs.d4", disabled, placeholder="You can't select me!")
        .fv-col-sm-6
          p Advanced Required:
          fv-select(v-model="inputs.d5", :search="true", multiple, placeholder="Select 3 items!", :required="function(){ return this.value.length === 3 }", :options="[{text: 'Silva', value: 'silva'}, {text: 'Ronaldinho', value: 'ronaldinho'}, {text: 'Ronaldo', value: 'ronaldo'}, {text: 'Pato', value: 'pato'}, {text: 'Hulk', value: 'hulk', disabled: true}]")
        .fv-col-sm-6
          p Loading...:
          fv-select(placeholder="Select me!", :options=['Pato', 'Robinho', 'Ronaldinho', 'Ronaldo', 'Roberto Carlos'], loading)
        .fv-col-12
          br
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
import '../../assets/images/face-01.jpg'
import '../../assets/images/face-02.jpg'
import '../../assets/images/face-03.jpg'
import '../../assets/images/face-04.jpg'
import '../../assets/images/face-05.jpg'
import '../../assets/images/face-06.jpg'

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
      d6opts: [
        {text: 'Omar Maldini', value: 'omar', icon: 'fa fa-git', avatar: 'face-01.jpg'},
        {text: 'Amir Sheva', value: 'amir', icon: 'fa fa-linux', avatar: 'face-02.jpg'},
        {text: 'Nazanin Adas', value: 'nazi', icon: 'fa fa-google-plus', avatar: 'face-03.jpg'},
        {text: 'Lady Gaga', value: 'ladygaga', icon: 'fa fa-spinner fa-spin', avatar: 'face-04.jpg'},
        {text: 'Maryam Ambro', value: 'maryam', icon: 'fa fa-google-plus', avatar: 'face-05.jpg'},
        {text: 'Daryoush', value: 'darush', icon: 'fa fa-spinner fa-spin', avatar: 'face-06.jpg'}
      ],
      api: {
        prop: [
          {
            name: 'value (required)',
            type: '',
            default: '',
            description: 'Value of select'
          },
          {
            name: 'dialog-class',
            type: '',
            default: '',
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
          },
          {
            name: 'delete-button',
            type: 'Boolean',
            default: 'true',
            description: 'Allow user to delete selected value.'
          }
        ],
        event: [
          {
            name: 'insert (added from 1.9.0)',
            params: '(new-option)',
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
            params: '',
            description: 'Open dialog'
          },
          {
            name: 'close',
            params: '',
            description: 'Close dialog'
          }
        ],
        scopedSlot: [
          {
            name: 'value',
            params: '(value, option)',
            description: 'value item in input box'
          },
          {
            name: 'option',
            params: '(option, selected)',
            description: 'option in list'
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar {
  margin: 8px 15px 8px 0;
  vertical-align: middle;

  &.mini {
    margin: 2px 4px 2px 0;
  }
}

.name {
  vertical-align: middle;
  display: inline-block;
  line-height: 1.2;
}
</style>
