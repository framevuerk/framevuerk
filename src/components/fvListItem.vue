<template lang="pug">
li.fv-list-item(:class="{highlighted: isHighlighted, selected: selected}",
  :disabled="disabled")
  .content(@click="onClick", @mousedown="onMousedown")
    .fv-no-wrap.text
      slot(name="default")
    fv-button.expand(v-if="hasSubList",
      @click="toggle()",
        tabindex="-1")
      i.fa(:class="{'fa-caret-down': !isExpanded,'fa-caret-up': isExpanded}")
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
      return this.$slots.hasOwnProperty('sub-list')
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
    onMousedown () {
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

  & .content {
    align-items: center;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    min-height: 3.5em;

    & > .text {
      flex-grow: 1;
      padding: 0 $padding;
    }

    & .expand {
      background: transparent;
      border: 0;
      border-radius: 0;
      box-shadow: inset 0 0 0 $primary-color;
      color: inherit;
      cursor: pointer;
      font-weight: bold;
      height: 100%;
      max-width: 45px;
      min-width: 45px;
      padding: 0 $padding;
      width: 45px;
    }
  }

  &[disabled] {
    @include disabled;
  }

  & > .content:hover,
  &.highlighted > .content {
    background: yiq($bg-color, 2%);
  }

  & > .content:active {
    background: yiq($bg-color, 5%);
  }

  &.selected {
    @include yiq($primary-color);

    & > .content:hover,
    &.highlighted > .content {
      background: yiq($primary-color, 2%);
    }

    & > .content:active {
      background: yiq($primary-color, 5%);
    }
  }

  & .sub-list {
    & > .fv-list {
      border-#{$block-end}: 0;
      border-#{$block-start}: solid 1em transparent;
      border-bottom: 0;
      border-top: 0;

      & > .fv-list-item:first-child {
        border-top: solid 1px $shadow-color-light;
      }
    }

    &.sub-list-enter-active,
    &.sub-list-leave-active {
      transform: translateX(0);
      transition-duration: $transition-speed;
      transition-property: opacity, transform;
      will-change: opacity, transform;
    }

    &.sub-list-enter,
    &.sub-list-leave-to {
      opacity: 0;
      transform: translateX(if($direction == 'ltr', -1em, 1em));
    }
  }
}
</style>
