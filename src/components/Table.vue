<template>
  <div
    :class="[$style.table, trueType]"
    :css-color="cssColor"
  >
    <table>
      <thead>
        <tr>
          <th
            v-for="(field, index) in fields"
            :key="fieldProp(field, 'title')"
            @click="$emit('titleClick', field, index)"
          >
            <slot
              v-if="hasSlot('title-' + field)"
              :name="'title-' + field"
              :field="field"
            />
            <slot
              v-else-if="hasSlot('title')"
              name="title"
              :field="field"
            />
            <div
              v-else
              css-text-align="center"
            >
              {{ fieldProp(field, 'title') }}
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in rows"
          :key="'row-' + index"
          @click="$emit('rowClick', row, index)"
        >
          <td
            v-for="(field, index2) in fields"
            :key="fieldProp(field, 'title')"
          >
            <div
              class="field-name"
              css-text-align="start"
              @click="$emit('titleClick', field, index2)"
            >
              <slot
                v-if="hasSlot('title-' + field)"
                :name="'title-' + field"
                :field="field"
                :type="trueType"
              />
              <slot
                v-else-if="hasSlot('title')"
                name="title"
                :field="field"
                :type="trueType"
              />
              <div
                v-else
              >
                {{ fieldProp(field, 'title') }}
              </div>
            </div>
            <div
              class="field-value"
              @click="$emit('titleClick', field, index2)"
            >
              <slot
                v-if="hasSlot('field-' + field)"
                :name="'field-' + field"
                :field="field"
                :row="row"
                :type="trueType"
              />
              <slot
                v-else-if="hasSlot('field')"
                name="field"
                :field="field"
                :row="row"
                :type="trueType"
              />
              <div
                v-else
                css-text-align="center"
              >
                {{ defaultFieldValueInRow(field, row) }}
              </div>
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

<doc>
@prop titleKey @type String @default '' @description If you've passed a list of objects to `fields` prop, pass the title key to this prop.
@prop valueKey @type String @default '' @description If you've passed a list of objects to `fields` prop, pass the value key to this prop.
@prop fields @type Array @default [] @description List of fields.
@prop rows @type Array @default [] @description List of rows.
@prop type @type oneOf('normal', 'breaked', 'smart') @default 'smart' @description Table render style. The 'normal' is like excel mode and 'breaked' is like mobile mode. 'smart' mode will be use one of those automaticly based on device size.

@event titleClick @description @params field @params fieldIndex @description Trigger when user clicks on a field name.
@event rowClick @description @params row @params rowIndex @description Trigger when user clicks on a row.

@slot footer @description Will be renders on `tfoot` section.
@slot title-${} @description Will be renders on `tfoot` section.

</doc>

<example>
@data fields = ['name', 'family', 'age']
@data rows = [{ name: 'Amir', family: 'Momenian', age: 32 }, { name: 'Maryam', family: 'Amini Asl', age: 24 }, { name: 'David', family: 'Beckham', age: 43 }, { name: 'Ricardo', family: 'Kaka', age: 38 }]

<fvTable :fields="fields" :rows="rows" css-color="background" />
</example>


<script>
import { hasSlot } from '../utility/utils';
import color from '../mixins/color';

export default {
  inject: ['$theme'],
  mixins: [
    color,
  ],
  props: {
    titleKey: {
      type: String,
      default: '',
    },
    valueKey: {
      type: String,
      default: '',
    },
    fields: {
      type: Array,
      default: () => [],
    },
    rows: {
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
      trueType: this.type,
    };
  },
  mounted() {
    if (this.type === 'smart') {
      this.handleSmart();
    }
  },
  methods: {
    hasSlot(name) {
      return hasSlot(this, name);
    },
    handleSmart() {
      this.trueType = window.innerWidth >= 992 ? 'normal' : 'breaked';
    },
    fieldProp(field, prop) {
      if (!prop) {
        return field;
      }
      switch (prop) {
        case 'title':
          return this.titleKey ? field[this.titleKey] : field;
        default:
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
  style({ className }) {
    return [
      className('table', {
        borderWidth: '1px',
        boxShadow: this.$theme.sizes.shadow.factor('md', 'shadow', { dir: 'bottom' }),
        borderRadius: this.$theme.sizes.radius.factor('md', 'radius'),
        borderColor: this.$theme.colors[this.$color].shade(-15),
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
          },
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
          '& tbody tr td .field-value': {
            textAlign: 'center',
          },
        },
      }),
    ];
  },
};
</script>
