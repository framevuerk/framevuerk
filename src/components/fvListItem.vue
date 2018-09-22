<template lang="pug">
li.fv-list-item(:class="{highlighted: isHighlighted, selected: selected}",
  :disabled="disabled")
  .content(@click="onClick", @mousemove="onHover")
    .fv-no-wrap.text
      slot(name="default")
    .expand(v-if="hasSubList",
      @click="toggle()",
      tabindex="-1",
      v-html="require('../icons/feather/chevron-down.svg')",
      :class="{rotate: isExpanded}")
  transition(name="sub-list")
    .sub-list(v-if="hasSubList",
      v-show="isExpanded",
      ref="subList")
      slot(name="sub-list")
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    expanded: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isExpanded: this.expanded || false
    }
  },
  computed: {
    hasSubList () {
      return this.$slots.hasOwnProperty('sub-list') || this.$scopedSlots.hasOwnProperty('sub-list')
    },
    isHighlighted () {
      const bigParent = this.bigParent()
      const normalHighlighted = bigParent !== false && bigParent.highlighted === this.$el
      const shouldHighlight = normalHighlighted && (bigParent.isFocused || bigParent.tabindex < 0)
      return normalHighlighted && shouldHighlight
    }
  },
  methods: {
    expand () {
      this.isExpanded = true
      this.$emit('expand')
    },
    collapse () {
      this.isExpanded = false
      this.$emit('collapse')
    },
    toggle () {
      if (this.isExpanded) {
        this.collapse()
      } else {
        this.expand()
      }
    },
    bigParent () {
      let ret = this
      while (ret) {
        if (ret.parent) {
          return ret
        }
        ret = ret.$parent
      }
      return false
    },
    onHover () {
      if (!this.disabled) {
        this.bigParent().highlighted = this.$el
      }
    },
    onClick (event) {
      const parent = this.bigParent()
      if (!this.disabled) {
        if (!parent.isFocused) {
          parent.$el.focus()
        }
        parent.highlighted = this.$el
        this.$emit('click', event)
      }
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-list-item {
  clear: both;
  overflow: hidden;
  border: 0;

  & .content {
    align-items: center;
    display: flex;
    position: relative;
    flex-direction: row;
    justify-content: space-between;
    min-height: 3em;

    & > .text {
      flex-grow: 1;
      padding: 0 $padding;
    }

    & .expand {
      padding: 0 $padding-small;
      cursor: pointer;
      transition: transform $transition-speed;

      & > svg {
        vertical-align: middle;
      }

      &.rotate {
        transform: rotateX(180deg);
      }
    }
  }

  & > .content,
  & > .sub-list {
    border-top: solid 1px contrast($bg-color, 2);
  }

  &[disabled] {
    & > .content {
      @include disabled(true);
    }
  }

  &.highlighted > .content,
  &:not(.unclickable):not([disabled]) > .content:hover {
    @include yiq(contrast($bg-color, 1));

    cursor: pointer;
  }

  &.selected {
    border-#{$block-start}: solid 4px $primary-color;
  }

  & .sub-list {
    & > .fv-list {
      border: 0;
      border-#{$block-start}: solid 1.5em transparent;
    }

    &.sub-list-enter-active,
    &.sub-list-leave-active {
      transition-duration: $transition-speed;
      transition-property: opacity, max-height;
      will-change: opacity, max-height;
      max-height: 100vh;
    }

    &.sub-list-enter,
    &.sub-list-leave-to {
      opacity: 0;
      max-height: 0;
    }
  }
}
</style>
