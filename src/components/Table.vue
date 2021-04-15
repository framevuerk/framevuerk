<template>
  <table
    :class="[$style.table, trueType]"
    :css-color="$color"
  >
    <thead>
      <tr>
        <slot name="labels" />
      </tr>
    </thead>
    <tbody>
      <slot name="rows" />
    </tbody>
  </table>
</template>

<doc>
@doc @description Try resize window to check style changes based on viewport size.

@slot th @description Use fvTableField with this slot name in top of component content. Each `th` slot counts as one field.
@slot tr @description Use fvTableRow with this slot name in component content just after defining `th`s. Each `tr` slot counts as one row.
</doc>

<example>
@data rows = [{ name: 'Amir', family: 'Momenian', age: 32 }, { name: 'Maryam', family: 'Amini Asl', age: 24 }, { name: 'David', family: 'Beckham', age: 43 }, { name: 'Ricardo', family: 'Kaka', age: 38 }]

<fvTable>
  <fvTableField slot="th" name="name"> First Name </fvTableField>
  <fvTableField slot="th" name="family"> Last Name </fvTableField>
  <fvTableField slot="th" name="age"> Age </fvTableField>

  <fvTableRow slot="tr" v-for="row in rows" :key="row.id">
    <fvTableField slot="td" name="name"> {{ row.name }} </fvTableField>
    <fvTableField slot="td" name="family"> {{ row.family }} </fvTableField>
    <fvTableField slot="td" name="age"> {{ row.age }} </fvTableField>
  </fvTableRow>
</fvTable>
</example>

<script>
import color from '../mixins/color';

export default {
  name: 'Table',
  inject: ['$layout', '$theme'],
  mixins: [
    color,
  ],
  props: {
    type: {
      type: String,
      default: 'smart',
      validator: (v) => ['grid', 'breaked', 'smart'].includes(v),
    },
    smartBreakWidth: {
      type: Number,
      default: 960,
    },
  },
  emits: ['update:current'],
  provide() {
    return {
      $table: this,
    };
  },
  data() {
    return {
      trueType: 'grid',
      resizeListener: null,
      labels: [], // filled by children (TableLabel)
    };
  },
  watch: {
    type: {
      handler(type) {
        this.$nextTick(() => {
          if (type === 'smart') {
            this.resizeListener = this.$layout.listen('resize', this.handleLayoutResize, true);
          } else if (this.resizeListener) {
            this.resizeListener.release();
            this.trueType = type;
          }
        });
      },
      immediate: true,
    },
  },
  methods: {
    handleLayoutResize({ width }) {
      if (width < this.smartBreakWidth) {
        this.trueType = 'breaked';
      } else {
        this.trueType = 'grid';
      }
    },
  },
  beforeUnmount() {
    if (this.resizeListener) {
      this.resizeListener.release();
    }
  },
  style({ className }) {
    const fieldCommonStyle = {
      padding: this.$theme.sizes.base.normal,
    };
    return [
      className('table', {
        borderWidth: '1px',
        boxShadow: this.$theme.sizes.shadow.factor('md', 'shadow', { dir: 'bottom' }),
        borderRadius: this.$theme.sizes.radius.factor('md', 'radius'),
        fontSize: this.$theme.sizes.font.factor('md', 'font'),
        width: '100%',
        maxWidth: '100%',
        '& > tbody > tr': {
          '&:nth-child(even)': {
            backgroundColor: this.$theme.colors.primary.autoShade(30, 0.1),
          },
          '&:not(:last-child) > td': {
            borderBottomWidth: '1px',
          },
          '& tbody tr:nth-child(odd)': {
            backgroundColor: this.$theme.colors.primary.autoShade(30, 0.1),
          },
        },
        '&.grid': {
          '& > tbody > tr > td': {
            '& > .label': {
              display: 'none',
            },
            '& > .value': {
              ...fieldCommonStyle,
              textAlign: 'center',
            },
          },
          '& > thead > tr > th': {
            ...fieldCommonStyle,
            borderBottomWidth: '1px',
            textAlign: 'center',
            fontWeight: 'bold',
          },
        },
        '&.breaked': {
          '& > thead': {
            display: 'none',
          },
          '& > tbody > tr': {
            display: 'block',
            '& > td': {
              display: 'flex',
              flexDirection: 'row',
              [`border-${this.$theme.direction.end}-width`]: '0 !important',
              '&:not(:last-child)': {
                borderBottomWidth: 0,
              },
              '& > .label': {
                ...fieldCommonStyle,
                flexGrow: 1,
                textAlign: this.$theme.direction.start,
                fontWeight: 'bold',
              },
              '& > .value': {
                ...fieldCommonStyle,
                // textAlign: this.$theme.direction.end,
              },
            },
          },
        },
      }),
    ];
  },
};
</script>
