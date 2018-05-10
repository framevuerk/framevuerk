<template lang="pug">
.fv-inputbox.fv-input(ref="inputEl",
  :tabindex="disabled? '': 0",
  :disabled="disabled",
  @click="onEnter",
  @keydown.enter="onEnter")
  .placeholder(v-html="placeholder")
  .value-container
    span.item(v-if="typeof value !== 'undefined'",
      v-for="(val, i) in value",
      :key="i")
        slot(v-if="$scopedSlots.value",
          name="value",
          :value="val")
        span(v-else) {{val}}
        .button.fa.fa-times(v-if="deleteButton",
          data-cancel-enter="true",
          @click="onValueDelete(val)")
    .item.transparent(v-if="$slots.in")
      slot(name="in")
  i.caret-icon(v-if="caretIcon",
    :class="caretIcon")
  .out-container(v-if="$slots.out")
    slot(name="out")
</template>

<script>
export default {
  props: {
    value: {
      type: Array
    },
    deleteButton: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    caretIcon: {
      default: ''
    }
  },
  methods: {
    onEnter (event) {
      if (!this.disabled && !event.target.getAttribute('data-cancel-enter')) {
        this.$emit('enter', event)
      }
    },
    onValueDelete (value) {
      this.$emit('value-delete', value)
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';

.fv-inputbox {
  cursor: pointer;

  & > .value-container {
    & > .item {
      @include shadow(bottom);

      float: $block-start;
      margin: $padding / 3;
      margin-#{$block-start}: 0;
      border: 1px solid darken($bg-color-light, $shadow-percent);
      padding: 0 $padding-small;
      border-radius: $border-radius;

      &.transparent {
        background: transparent;
        padding: 0;
        border: 0;
        box-shadow: none;
      }

      & .button {
        margin-#{$block-start}: $padding;
        cursor: pointer;

        &:hover {
          background-color: yiq($bg-color, 2%);
        }

        &:active {
          background-color: yiq($bg-color, 10%);
        }
      }
    }
  }

  & > .caret-icon {
    float: $block-end;
    padding: $padding-small;
    padding-#{$block-start}: $padding;
  }

  & > .out-container {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
  }
}
</style>
