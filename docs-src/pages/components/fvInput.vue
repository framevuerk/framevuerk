<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To create full featured input in your application, use this!
    doc-code
      = "<fv-input></fv-input>"
    doc-example
      .fv-row
        .fv-col-xs-12
          h4 Sizes:
        .fv-col-sm-6
          p X-Small
          fv-input.fv-xs.fv-block(placeholder=".fv-xs")
        .fv-col-sm-6
          p Small
          fv-input.fv-sm.fv-block(placeholder=".fv-sm")
        .fv-col-sm-6
          p Medium (default)
          fv-input.fv-md.fv-block(placeholder=".fv-md")
        .fv-col-sm-6
          p Large
          fv-input.fv-lg.fv-block(placeholder=".fv-lg")
        .fv-col-sm-6
          p X-Large
          fv-input.fv-xl.fv-block(placeholder=".fv-xl")
        .fv-row
          hr.fv-hr
      .fv-row
        .fv-col-xs-12
          h4 States:
        .fv-col-sm-6
          p Invalid
          fv-input.fv-block(placeholder="[invalid]", invalid)
        .fv-col-sm-6
          p Disabled
          fv-input.fv-block(placeholder="[disabled]", disabled)
        .fv-row
          hr
      .fv-row
        .fv-col-xs-12
          h4 Usage:
        .fv-col-sm-12
          p Default:
          fv-input.fv-block(v-model="inputs.d1", placeholder="Enter your age")
        .fv-col-sm-12
          p Display value + required: {{inputs.d2.value}}
          .fv-input-group.fv-flex
            fv-input.fv-grow(v-model="inputs.d2.value", :display-value="inputs.d2.displayValue", render-type="display", placeholder="I'm required!", required)
            fv-button(@click.native="inputs.d2.value = undefined; inputs.d2.displayValue = null;") Clear
            fv-button(@click.native="inputs.d2.value = new Date().getTime(); inputs.d2.displayValue = new Date(inputs.d2.value).getMilliseconds();") Change
        .fv-col-sm-12
          p Advanced Required:
          fv-input.fv-block(v-model="inputs.d3", placeholder="Enter mobile number", :required="function(){ return this.value.length === 11 && this.value.indexOf('09') === 0 }")
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
        d1: '',
        d2: {
          value: undefined,
          displayValue: null
        },
        d3: ''
      },
      api: {
        prop: [
          {
            name: 'value || v-model (required)',
            type: '',
            default: 'undefined',
            description: 'Value of input'
          },
          {
            name: 'render-type',
            type: 'Enum ["normal", "display"]',
            default: '"normal"',
            description: 'Render type of input'
          },
          {
            name: 'display-value',
            type: '',
            default: 'undefined',
            description: 'Display value of input.<br>Only used when render-type = "display"<br>Normally used for models like Id or something like that to show meaningful data, so normal usability of input by using this will be lost.'
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
            name: 'caretIcon',
            type: '---',
            default: '""',
            description: 'Icon of input<br>Only used when render-type = "display"'
          }
        ],
        event: [
          {
            name: 'click',
            params: '---',
            description: 'Fired when input clicked'
          },
          {
            name: 'enter',
            params: '---',
            description: 'Fired When used click or press enter key on focused state.<br>Only used when render-type = "display"'
          }
        ],
        method: []
      }
    }
  }
}
</script>
