<template lang="pug">
fv-content
  div(:class="$root.mainClass")
    doc-description
      | To creating responsive table inside your application, use this component. (added from 1.4.0)
    doc-code
      = "<fv-table2></fv-table2>"
    doc-example
      .fv-row
        .fv-col-xs-12
          h4 Usage:
        .fv-col-xs-12
          p Normal:
        .fv-col-xs-12
          fv-table2(:rows="list", :fields="fields", :breaked="false")
            template(slot="field-Name", slot-scope="scope")
              fv-avatar(:src="scope.row.avatar", size="24px")
              =" "
              p.fv-inline {{scope.row.text}}
            template(slot="field-Username", slot-scope="scope")
              | @{{scope.row.value}}
            template(slot="field-Birth Date", slot-scope="scope")
              span(v-if="scope.row.bdate") {{dateFormat(scope.row.bdate)}}
              span(v-else) ---
        .fv-col-xs-12
          p Same, with 'breaked' prop:
        .fv-col-xs-12
          fv-table2(:rows="list", :fields="fields", breaked)
            template(slot="field-Name", slot-scope="scope")
              fv-avatar(:src="scope.row.avatar", size="24px")
              =" "
              p.fv-inline {{scope.row.text}}
            template(slot="field-Username", slot-scope="scope")
              | @{{scope.row.value}}
            template(slot="field-Birth Date", slot-scope="scope")
              span(v-if="scope.row.bdate") {{dateFormat(scope.row.bdate)}}
              span(v-else) ---
    doc-api(:rows="api")
</template>

<script>
import docApi from '../../components/docApi.vue'
import docDescription from '../../components/docDescription.vue'
import docExample from '../../components/docExample.vue'
import docCode from '../../components/docCode.vue'
import axios from 'axios'
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
      axios,
      fields: [
        'Name',
        'Username',
        'Birth Date'
      ],
      list: [
        {text: 'Omar Maldini', value: 'omar', bdate: new Date('27 sept 1992'), avatar: 'face-01.jpg'},
        {text: 'Amir Sheva', value: 'amir', bdate: new Date('26 aug 1993'), avatar: 'face-02.jpg'},
        {text: 'Nazanin Adas', value: 'nazi', bdate: new Date('14 feb 2001'), avatar: 'face-03.jpg'},
        {text: 'Lady Gaga', value: 'ladygaga', bdate: new Date('2 jan 1990'), avatar: 'face-04.jpg'},
        {text: 'Maryam Ambro', value: 'maryam', bdate: new Date('1 sept 1899'), avatar: 'face-05.jpg'},
        {text: 'Daryoush', value: 'darush', bdate: new Date('1 april 1882'), avatar: 'face-06.jpg'},
        {text: 'Reza', value: 'rzm', bdate: null, avatar: 'face-02.jpg'}
      ],
      api: {
        prop: [
          {
            name: 'fields',
            type: 'Array',
            default: '[]',
            description: 'List of table fields as String.'
          },
          {
            name: 'rows',
            type: 'Array',
            default: '[]',
            description: 'List of table rows.'
          },
          {
            name: 'breaked',
            type: 'Enum [null, true, false]',
            default: 'null',
            description: 'Add mobile style to table. `null` value means \'auto\''
          }
        ],
        scopedSlot: [
          {
            name: 'field-X',
            params: '(row, field, index)',
            description: 'Field template in row. "X" in slot name replaced by field name in runtime. For example if you set fields prop by ["AA", "BB"], you have two slot named "field-AA" and "field-BB"'
          }
        ],
        slot: [
          {
            name: 'footer',
            description: 'footer content'
          }
        ]
      }
    }
  },
  methods: {
    dateFormat (dt) {
      return dt.toDateString()
    }
  }
}
</script>
