<template lang="pug">
.fv-table(:class="{breaked: isBreaked, title: showTitle}")
  table
    thead(v-if="showTitle")
      tr
        th(v-for="(field, index) in fields",
          :key="fieldProp(field, 'title')",
          @click="$emit('titleClick', field, index)")
          slot(v-if="$scopedSlots['title-'+fieldProp(field, 'value')] || $slots['title-'+fieldProp(field, 'value')]", :name="'title-'+fieldProp(field, 'value')", :field="field", :index="index", :breaked="isBreaked")
          slot(v-else-if="$scopedSlots.title || $slots.title", name="title", :field="field", :index="index", :breaked="isBreaked")
          span(v-else) {{fieldProp(field, 'title')}}
    tbody
      tr(v-for="(row, index) in rows",
        :key="index",
        @click="$emit('rowClick', row, index)")
        td(v-for="(field, index2) in fields",
          :key="fieldProp(field, 'title')")
          .field-name(v-if="isBreaked && showTitle", @click="$emit('titleClick', field, index2)")
            slot(v-if="$scopedSlots['title-'+fieldProp(field, 'value')] || $slots['title-'+fieldProp(field, 'value')]", :name="'title-'+fieldProp(field, 'value')", :field="field", :index="index", :breaked="isBreaked")
            slot(v-else-if="$scopedSlots.title || $slots.title", name="title", :field="field", :index="index", :breaked="isBreaked")
            span(v-else) {{fieldProp(field, 'title')}}
          .field-value
            slot(v-if="$scopedSlots['field-'+fieldProp(field, 'value')] || $slots['field-'+fieldProp(field, 'value')]", :name="'field-'+fieldProp(field, 'value')", :row="row", :field="field", :index="index", :breaked="isBreaked")
            slot(v-else-if="$scopedSlots.field || $slots.field", name="field", :field="field", :row="row", :index="index", :breaked="isBreaked")
            span(v-else) {{defaultFieldValueInRow(field, row)}}
    tfoot(v-if="$scopedSlots.footer || $slots.default")
      slot(name="footer")
</template>

<script>
import parent from '../utility/parent.js'

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
      type: [Boolean, Object],
      validator: (value) => {
        return [true, false, null].indexOf(value) > -1
      },
      default: null
    }
  },
  data () {
    return {
      isBreaked: this.breaked || false
    }
  },
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
      if (this.pin !== null) {
        return
      }
      const isBreaked = parent.getSize().indexOf('lg') === -1
      this.isBreaked = isBreaked
      this.$emit('breakedChange', isBreaked)
    }
  },
  mounted () {
    parent.on('sizechange', this.onResize)
    this.onResize()
  },
  beforeDestroy () {
    parent.off('sizechange', this.onResize)
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-table {
  @include shadow(bottom);

  border: 1px solid var(--colors-background-border);
  border-radius: var(--sizes-radius-md);
  overflow: auto;

  & > table {
    border-spacing: 0;
    border-collapse: collapse;
    cursor: default;
    max-width: 100%;
    width: 100%;

    & tr {
      &:not(:last-child) {
        border-bottom: 1px solid var(--colors-background-border);
      }

      &:nth-child(even) {
        background: var(--colors-background-hover);
      }
    }

    & th,
    & td {
      text-align: center;
      padding: var(--sizes-space-sm) var(--sizes-space-md);
      vertical-align: middle;
    }

    & thead {
      @include shadow(bottom);

      border-bottom: 1px solid var(--colors-background-border);
    }

    & tfoot {
      @include shadow(inset-bottom);

      border-top: 1px solid var(--colors-background-border);
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
          padding-#{$block-end}: var(sizes-space-sm);
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
