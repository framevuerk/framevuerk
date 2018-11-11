<template lang="pug">
.fv-form-element(:class="{ 'single-line': singleLine, 'multi-line': !singleLine, inline: isInline, block: !isInline }")
  label(:class="{ highlighted: isHighlighted, valid: isValid, unvalid: !isValid }")
    slot(v-if="$slots.label || $scopedSlots.label", :label="label", :highlighted="isHighlighted", name="label")
    span(v-else) {{label}}
  .container(v-if="singleLine || isInline")
    slot
  slot(v-else)
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    singleLine: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isHighlighted: false
    }
  },
  provide () {
    return {
      fvFormElement: this
    }
  },
  computed: {
    isInline () {
      const cName = slot => slot.componentOptions ? slot.componentOptions.tag : ''
      for (let i of this.$slots.default) {
        if (['fvInput', 'fvInputbox', 'fvDatepicker', 'fvSelect', 'fvRange', 'fvTextarea'].indexOf(cName(i)) > -1) {
          return false
        }
      }
      return true
    }
  },
  methods: {
    turn (on = true) {
      this.isHighlighted = on
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';

.fv-form-element {
  display: flex;

  & > label {
    @include nowrap;

    color: $color-light;
    display: block;
    min-width: 25%;

    &.highlighted {
      color: $color;
    }
  }

  &.multi-line {
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    & > label {
      padding-bottom: padding(sm);
    }

    & > * {
      font-family: inherit;
      min-width: 100%;
      max-width: 100%;
      width: 100%;
    }
  }

  &.single-line {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    & > .container {
      display: flex;
      flex-direction: row-reverse;
      flex-wrap: wrap;
      align-items: center;
    }

    & > * {
      font-family: inherit;

      &:last-child {
        margin-#{$block-start}: padding(md);
        flex-grow: 1;
      }
    }

    &.block > .container > * {
      font-family: inherit;
      max-width: 100%;
      width: 100%;
      min-width: 100%;
    }
  }
}
</style>
