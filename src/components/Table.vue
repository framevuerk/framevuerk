<template>
<div :class="[$style.table, className]">
  <table>
    <thead>
      <tr>
        <th v-for="(field, index) in fields" :key="fieldProp(field, 'title')" @click="$emit('titleClick', field, index)">
          <slot name="title" :field="field" />
          <span v-if="!$scopedSlots.title && !$slots.title"> {{ fieldProp(field, 'title') }} </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in rows" :key="'row-' + index" @click="$emit('rowClick', row, index)">
        <td v-for="(field, index2) in fields" :key="fieldProp(field, 'title')">
          <div class="field-name" @click="$emit('titleClick', field, index2)">
            <slot name="title" :field="field" />
            <span v-if="!$scopedSlots.title && !$slots.title"> {{ fieldProp(field, 'title') }} </span>
          </div>
          <div class="field-value" @click="$emit('titleClick', field, index2)">
            <slot name="field" :field="field" :row="row" />
            <span v-if="!$scopedSlots.field && !$slots.field"> {{ defaultFieldValueInRow(field, row) }} </span>
          </div>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <slot name="footer" />
    </tfoot>
  </table>
</div>
</template>

<example>
@data fields = ['name', 'family', 'age']
@data rows = [{ name: 'Amir', family: 'Momenian', age: 32 }, { name: 'Maryam', family: 'Amini Asl', age: 24 }, { name: 'Amir', family: 'Momenian', age: 32 }, { name: 'Maryam', family: 'Amini Asl', age: 24 }, { name: 'Amir', family: 'Momenian', age: 32 }, { name: 'Maryam', family: 'Amini Asl', age: 24 }, { name: 'Amir', family: 'Momenian', age: 32 }, { name: 'Maryam', family: 'Amini Asl', age: 24 }, { name: 'Amir', family: 'Momenian', age: 32 }, { name: 'Maryam', family: 'Amini Asl', age: 24 }, { name: 'Amir', family: 'Momenian', age: 32 }, { name: 'Maryam', family: 'Amini Asl', age: 24 }, { name: 'Amir', family: 'Momenian', age: 32 }, { name: 'Maryam', family: 'Amini Asl', age: 24 }, { name: 'Amir', family: 'Momenian', age: 32 }, { name: 'Maryam', family: 'Amini Asl', age: 24 }]

<fvTable :fields="fields" :rows="rows" >
</fvTable>
</example>


<script>
export default {
  inject: ['$theme'],
  props: {
    titleKey: {
      type: String,
      default: '',
    },
    valueKey: {
      type: String,
      default: '',
    },
    rows: {
      type: Array,
      default: () => [],
    },
    fields: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      validator: (value) => ['normal', 'breaked', 'smart'].indexOf(value) > -1,
      default: 'smart',
    },
  },
  data() {
    return {
      className: this.type,
    };
  },
  methods: {
    handleSmart() {
      this.className = window.innerWidth >= 992 ? 'normal' : 'breaked';
    },
    fieldProp(field, prop) {
      if (!prop) {
        return field;
      }
      switch (prop) {
        case 'title':
          return this.titleKey ? field[this.titleKey] : field;
        case 'value':
          return this.valueKey ? field[this.valueKey] : field;
      }
    },
    defaultFieldValueInRow(field, row) {
      if (typeof row === 'object') {
        const prop = this.fieldProp(field, 'value');
        if (typeof prop !== 'object') {
          return row[prop];
        }
        return row;
      }
      return row;
    },
  },
  mounted() {
    if (this.type === 'smart') {
      this.handleSmart();
    }
  },
  style({ className }) {
    return [
      className('table', {
        borderWidth: '1px',
        boxShadow: this.$theme.sizes.shadow.factor('md', 'shadow', { dir: 'bottom' }),
        borderRadius: this.$theme.sizes.radius.factor('md', 'radius'),
        overflow: 'hidden',
        '& > table': {
          width: '100%',
          '& td, & th': {
            textAlign: this.$theme.direction.start,
            padding: `${this.$theme.sizes.base.factor('md', 'size')}`,
            backgroundColor: 'transparent',
          },
          '& tbody tr:nth-child(odd)': {
            backgroundColor: this.$theme.colors.primary.autoShade(30, 0.1),
          },
        },
        '&.breaked': {
          '& thead': {
            display: 'none',
          },
          '& tbody tr td': {
            [`border-${this.$theme.direction.end}-width`]: 0,
          },
          '& tbody tr:not(:last-child) td:last-child': {
            borderBottomWidth: '1px',
          },
          '& td': {
            display: 'flex',
            flexDirection: 'row',
            '& > .field-name': {
              display: 'block',
              fontWeight: 'bold',
              flexGrow: 1,
            },
          }
        },
        '&.normal': {
          '& thead th, & tbody tr:not(:last-child) td': {
            borderBottomWidth: '1px',
          },
          '& thead th:not(:last-child), & tbody tr td:not(:last-child)': {
            [`border-${this.$theme.direction.end}-width`]: '1px',
          },
          '& th': {
            position: 'sticky',
            top: 0,
          },
          '& tbody tr td .field-name': {
            display: 'none',
          },
        }
      })
    ];
  },
};
</script>