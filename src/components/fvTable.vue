<template lang="pug">
.fv-table(:class="{breaked: breaked, title: showTitle}")
  table
    thead(v-if="showTitle")
      tr
        th(v-for="field in fields",
          :key="fieldProp(field, 'title')")
          slot(v-if="$scopedSlots['title-'+fieldProp(field, 'value')] || $slots['title-'+fieldProp(field, 'value')]", :name="'title-'+fieldProp(field, 'value')", :field="field", :index="index", :breaked="breaked")
          slot(v-else-if="$scopedSlots.title || $slots.title", name="title", :field="field", :index="index", :breaked="breaked")
          span(v-else) {{fieldProp(field, 'title')}}
    tbody
      tr(v-for="(row, index) in rows",
        :key="index")
        td(v-for="(field, index2) in fields",
          :key="fieldProp(field, 'title')")
          .field-name(v-if="breaked && showTitle")
            slot(v-if="$scopedSlots['title-'+fieldProp(field, 'value')] || $slots['title-'+fieldProp(field, 'value')]", :name="'title-'+fieldProp(field, 'value')", :field="field", :index="index", :breaked="breaked")
            slot(v-else-if="$scopedSlots.title || $slots.title", name="title", :field="field", :index="index", :breaked="breaked")
            span(v-else) {{fieldProp(field, 'title')}}
          .field-value
            slot(v-if="$scopedSlots['field-'+fieldProp(field, 'value')] || $slots['field-'+fieldProp(field, 'value')]", :name="'field-'+fieldProp(field, 'value')", :row="row", :field="field", :index="index", :breaked="breaked")
            slot(v-else-if="$scopedSlots.field || $slots.field", name="field", :field="field", :row="row", :index="index", :breaked="breaked")
            span(v-else) {{defaultFieldValueInRow(field, row)}}
    tfoot(v-if="$scopedSlots.footer || $slots.default")
      slot(name="footer")
</template>

<script>
import utility from '../utility'

export default {
  props: {
    fields: {
      type: Array,
      default: () => []
    },
    titleKey: {
      type: String,
      default: ''
    },
    valueKey: {
      type: String,
      default: ''
    },
    rows: {
      type: Array,
      default: () => []
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    breaked: {
      type: Boolean,
      default: false
    }
  },
  inject: ['fvMain'],
  methods: {
    fieldProp (field, prop) {
      if (!prop) {
        return field
      }
      switch (prop) {
        case 'title':
          return this.titleKey ? field[this.titleKey] : field
        case 'value':
          return this.valueKey ? field[this.valueKey] : field
      }
    },
    defaultFieldValueInRow (field, row) {
      if (typeof row === 'object') {
        const prop = this.fieldProp(field, 'value')
        if (typeof prop !== 'object') {
          return row[prop]
        }
        return row
      }
      return row
    },
    onResize () {
      const parentSize = this.fvMain.getSize()

      if (parentSize.indexOf('lg') === -1) {
        this.$emit('update:breaked', true)
      } else {
        this.$emit('update:breaked', false)
      }
    }
  },
  mounted () {
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },
  created () {
    if (!this.fvMain) {
      throw utility.error('no_fvmain_parent')
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-table {
  @include shadow(bottom);

  border: 1px solid contrast($bg-color, 2);
  border-radius: $border-radius;
  overflow: auto;

  & > table {
    border-spacing: 0;
    border-collapse: collapse;
    cursor: default;
    max-width: 100%;
    width: 100%;

    & tr {
      &:not(:last-child) {
        border-bottom: 1px solid contrast($bg-color, 2);
      }

      &:nth-child(even) {
        background: contrast($bg-color, 1);
      }
    }

    & th,
    & td {
      text-align: center;
      padding: $padding-small $padding;
      vertical-align: middle;
    }

    & thead {
      @include shadow(bottom);

      border-bottom: 1px solid contrast($bg-color, 2);
    }

    & tfoot {
      @include shadow(inset-bottom);

      border-top: 1px solid contrast($bg-color, 2);
    }
  }

  &.breaked {
    & > table {
      & thead {
        display: none;
      }

      & td {
        display: flex;
        text-align: $block-end;

        & .field-name {
          float: $block-start;
          font-weight: bold;
          padding-#{$block-end}: $padding-small;
        }

        & .field-value {
          flex-grow: 1;
        }
      }
    }

    &:not(.title) > table td {
      text-align: $block-start;
    }
  }
}
</style>
