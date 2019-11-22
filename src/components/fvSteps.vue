<template lang="pug">
.fv-row.fv-steps
  .step.fv-col.fv-col-lower-sm-12(v-for="(step, i) in steps",
    :class="{highlighted: i <= value, completed: i < value}",
    @click="$emit('input', i)")
    .top
      .line.before
      h2.box
        slot(v-if="$scopedSlots.box || $slots.box", name="box", :step="step", :index="i")
        span(v-else, v-text="i + 1")
      .line.after
    h3.text
      slot(v-if="$scopedSlots.text || $slots.text", name="text", :step="step", :index="i")
      span(v-else, v-text="step")
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    steps: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      searchTimeout: null,
      searching: false,
      suggestions: []
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';
$box-size: 2em;
$line-height: 0.8em;

.fv-steps {
  padding: 0;
  user-select: none;
  overflow: hidden;
  font-size: fontSize(md);
  min-height: heightSize(md);
  // line-height: heightSize(md);

  & > .step {
    text-align: center;
    padding: 0;

    & > .top {
      position: relative;

      & .box {
        width: $box-size;
        height: $box-size;
        background: darken($bg-color-light, $shadow-percent);
        color: #fff;
        border-radius: $border-radius;
        text-align: center;
        line-height: $box-size;
        display: inline-block;
      }

      & .line {
        position: absolute;
        height: $line-height;
        background: darken($bg-color-light, $shadow-percent);
        top: $box-size / 2;
        width: calc(51% - #{$box-size - $line-height});

        &.before {
          width: calc(51% - #{$box-size - $line-height});
          #{$block-start}: 0;
        }

        &.after {
          width: calc(51% - #{$box-size - $line-height});
          #{$block-start}: calc(50% + #{$box-size - $line-height});
        }
      }
    }

    & > .text {
      color: darken($bg-color-light, $shadow-percent);
      padding: var(size-padding-small) 0;
      line-height: 1;
    }

    &.highlighted {
      & > .top {
        & > .box,
        & > .line.before {
          background: $primary-color;
        }

        & > .line.after {
          background: linear-gradient(to #{$block-end}, $primary-color, darken($bg-color-light, $shadow-percent));
        }
      }

      & > .text {
        color: $primary-color;
      }

      &.completed {
        & > .top {
          & > .line.after {
            background: $primary-color;
          }

          & > .box {
            box-shadow: none;
          }
        }
      }
    }
  }
}
</style>
