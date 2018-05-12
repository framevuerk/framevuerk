<template lang="pug">
.fv-table2(:class="{breaked: isBreaked, title: title}")
  table
    thead(v-if="title")
      tr
        th(v-for="field in fields",
          :key="field")
          | {{field}}
    tbody
      tr(v-for="(row, index) in rows",
        :key="index")
        td(v-for="(field, index2) in fields",
          :key="field")
          .field-name(v-if="isBreaked && title") {{field}}
          .field-value
            slot(:name="'field-' + field",
              :row="row",
              :field="field",
              :index="index")
    tfoot(v-if="$slots.footer")
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
  created () {
    console.warn("Component 'fv-table' will replaced by 'fv-table2' in version 2.x.y.")
  },
  mounted () {
    if (this.breaked === null) {
      this.isBreaked = utility.isSmallViewport()
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-table2 {
  @include shadow(bottom);

  border: 1px solid $shadow-color;
  border-radius: $border-radius;
  overflow: hidden;

  & > table {
    border-spacing: 0;
    border-collapse: collapse;
    cursor: default;
    max-width: 100%;
    width: 100%;

    & tr {
      &:not(:last-child) {
        border-bottom: 1px solid darken($bg-color-light, $shadow-percent);
      }

      &:nth-child(even) {
        background: yiq($bg-color, 2%);
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

      border-bottom: 1px solid darken($bg-color-light, $shadow-percent);
    }

    & tfoot {
      @include shadow(inset-bottom);

      border-top: 1px solid darken($bg-color-light, $shadow-percent);
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
