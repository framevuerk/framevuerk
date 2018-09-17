<template lang="pug">
.fv-table(:class="{breaked: isBreaked, title: title}")
  table
    thead(v-if="title")
      tr
        th(v-for="field in fields",
          :key="field")
          slot(v-if="$scopedSlots['title-'+field] || $slots['title-'+field]", :name="'title-'+field", :field="field", :index="index")
          span(v-else) {{field}}
    tbody
      tr(v-for="(row, index) in rows",
        :key="index")
        td(v-for="(field, index2) in fields",
          :key="field")
          .field-name(v-if="isBreaked && title") {{field}}
          .field-value
            slot(v-if="$scopedSlots['field-'+field] || $slots['field-'+field]", :name="'field-'+field", :row="row", :field="field", :index="index")
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
    rows: {
      type: Array,
      default: () => []
    },
    title: {
      type: Boolean,
      default: true
    },
    breaked: {
      type: [Object, Boolean],
      validator: (value) => {
        return [true, false, null].indexOf(value) > -1
      },
      default: null
    }
  },
  data () {
    return {
      isBreaked: this.breaked
    }
  },
  methods: {
    defaultFieldValueInRow (field, row) {
      if (typeof row === 'object') {
        return row[field]
      }
      return row
    }
  },
  mounted () {
    if (this.breaked === null) {
      const main = utility.fvParent(this, 'fvMain')
      this.isBreaked = utility.viewportSize(main.$el).indexOf('md') === -1
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
