<template>
  <table
    :class="[$style.table]"
    :css-color="$color"
  >
    <template v-if="trueType === 'grid'">
      <thead>
        <render-slot
          :slots="labels"
        />
      </thead>
      <tbody>
        <custom-slot
          :uid="$.uid"
          component="TableRow"
        />
      </tbody>
    </template>
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
import CustomSlot from './_CustomSlot.vue';
import findSlots from '../utility/findSlots';
import RenderSlot from './_RenderSlot.vue';
import _RenderSlot from './_RenderSlot.vue';

export default {
  name: 'Table',
  inject: ['$layout', '$theme'],
  emits: ['update:current'],
  components: {
    CustomSlot,
  },
  mixins: [
    color,
  ],
  props: {
    type: {
      type: String,
      default: 'smart',
      validator: (v) => ['grid', 'smart', 'inline'].includes(v),
    },
  },
  provide() {
    return {
      $table: this,
    };
  },
  data() {
    return {
      fields: [], // filled by childs
      trueType: null,
      resizeListener: null,
      labels: [],
    };
  },
  watch: {
    type: {
      handler(type) {
        this.$nextTick(() => {
          this.$el.classList.remove('pre-show', 'show');
          if (type === 'smart') {
            this.resizeListener = this.$layout.listen('resize', this.handleLayoutResize, true);
          } else if (this.scrollListener) {
            this.trueType = type;
            this.resizeListener.release();
          }
        });
      },
      immediate: true,
    },
  },
  beforeUnmount() {
    if (this.resizeListener) {
      this.resizeListener.release();
    }
  },
  mounted() {
    this.labels = findSlots(this, (slot) => slot.type.name === 'TableLabel');
  },
  methods: {
    handleLayoutResize() {
      const isLargeLayout = window.innerWidth >= 992;
      this.trueType = isLargeLayout ? 'grid' : 'inline';
    },
  },
  style({ className, mediaQuery }) {
    const fieldContainerCommonStyle = {
      textAlign: 'center',
      padding: `${this.$theme.sizes.base.factor('md', 'size')}`,
      backgroundColor: 'transparent',
      verticalAlign: 'middle',
    };

    return [
      className('table', {
        borderWidth: '1px',
        boxShadow: this.$theme.sizes.shadow.factor('md', 'shadow', { dir: 'bottom' }),
        borderRadius: this.$theme.sizes.radius.factor('md', 'radius'),
        fontSize: this.$theme.sizes.font.factor('md', 'font'),
        width: '100%',
        maxWidth: '100%',
        '& > thead > th': {
          ...fieldContainerCommonStyle,
          borderBottomWidth: '1px',
          backgroundColor: 'rgba(0, 0, 0, 0.03)',
          fontWeight: 'bold',
          '&:not(:last-child)': {
            [`border-${this.$theme.direction.end}-width`]: '1px',
          },
        },
        '& > tbody > tr': {
          '&:nth-child(even)': {
            backgroundColor: this.$theme.colors.primary.autoShade(30, 0.1),
          },
          '&:not(:last-child) td': {
            borderBottomWidth: '1px',
          },
          '& td': {
            ...fieldContainerCommonStyle,
            '&:not(:last-child)': {
              [`border-${this.$theme.direction.end}-width`]: '1px',
            },
          },
          '& tbody tr:nth-child(odd)': {
            backgroundColor: this.$theme.colors.primary.autoShade(30, 0.1),
          },
          '& > td > .title': {
            display: 'none',
          },
        },
      }),
      mediaQuery({ maxWidth: '1200px' }, [
        className('table', {
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
              '& > .title': {
                display: 'block',
                textAlign: this.$theme.direction.start,
                fontWeight: 'bold',
                minWidth: '20%',
              },
              '& > .value': {
                flexGrow: '1',
                textAlign: this.$theme.direction.end,
              },
            },
          },
        }),
      ]),
    ];
  },
};
</script>
