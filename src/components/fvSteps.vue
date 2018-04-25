<template lang="pug">
.fv-row.fv-steps
  .step.fv-col.fv-col-lower-sm-12(v-for="(step, i) in steps",
    :class="{highlighted: i <= value, completed: i < value}")
    .top
      .line.before
      h2.circle
        slot(v-if="$scopedSlots.circle", name="circle", :step="step", :highlighted="i <= value", :completed="i < value", :index="i")
        span(v-else, v-text="i + 1")
      .line.after
    h3.text
      slot(v-if="$scopedSlots.text", name="text", :step="step", :highlighted="i <= value", :completed="i < value", :index="i")
      span(v-else, v-text="step")
</template>

<script>
export default {
  props: {
    steps: Array,
    value: {
      type: Number,
      default: 0
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
$circle-size: 50px;
$line-height: 10px;

.fv-steps {
  padding: 0;

  & > .step {
    text-align: center;
    padding: 0;

    & > .top {
      position: relative;

      & .circle {
        width: $circle-size;
        height: $circle-size;
        background: darken($bg-color-light, $shadow-percent);
        color: #fff;
        border-radius: $circle-size / 2;
        text-align: center;
        line-height: $circle-size;
        display: inline-block;
      }

      & .line {
        position: absolute;
        height: $line-height;
        background: darken($bg-color-light, $shadow-percent);
        top: #{($circle-size - $line-height) / 2};
        width: calc(50% - #{$circle-size - $line-height});

        &.before {
          width: calc(50% - #{$circle-size - $line-height});
          #{$block-start}: 0;
        }

        &.after {
          width: calc(50% - #{$circle-size - $line-height});
          #{$block-start}: calc(50% + #{$circle-size - $line-height});
        }
      }
    }

    & > .text {
      color: darken($bg-color-light, $shadow-percent);
      padding-top: $padding;
      line-height: 1;
    }

    &.highlighted {
      & > .top {
        & > .circle {
          box-shadow: 0 0 0 2px $bg-color, 0 0 0 4px $primary-color;
        }

        & > .circle,
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

          & > .circle {
            box-shadow: none;
          }
        }
      }
    }
  }
}
</style>
