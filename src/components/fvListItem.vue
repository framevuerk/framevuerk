<template lang="pug">
li.fv-list-item(:disabled="disabled")
  .content(@click="onClick")
    .text
      slot(name="default")
    .expand(v-if="hasSubList",
      @click="toggle",
      tabindex="-1",
      v-html="icon",
      :class="{rotate: isExpanded}")
  transition(name="sub-list")
    .sub-list(v-if="hasSubList",
      v-show="isExpanded",
      ref="subList")
      slot(name="sub-list")
</template>

<script>
import icon from '../icons/ARR.svg'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    expanded: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isExpanded: this.expanded,
      icon
    }
  },
  computed: {
    hasSubList () {
      return this.$slots.hasOwnProperty('sub-list') || this.$scopedSlots.hasOwnProperty('sub-list')
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
    toggle (event) {
      event.stopPropagation()
      if (this.isExpanded) {
        this.collapse()
      } else {
        this.expand()
      }
    },
    onClick (event) {
      if (!this.disabled) {
        this.$emit('click', event)
      }
    },
    onHover () { // called by parent
      this.$emit('hover')
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
  min-height: heightSize(md);

  & .content {
    align-items: center;
    display: flex;
    position: relative;
    flex-direction: row;
    justify-content: space-between;
    min-height: inherit;

    & > .text {
      @include nowrap;

      flex-grow: 1;
      padding: 0 $padding;
    }

    & .expand {
      padding: 0 ($padding / 2);
      cursor: pointer;

      & > svg {
        vertical-align: middle;
        width: 1.4em;
        height: auto;
        transition: transform $transition-speed;
      }

      &.rotate {
        & > svg {
          transform: rotateX(180deg);
        }
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

  &.highlighted > .content {
    @include yiq(contrast($bg-color, 1));
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
      backface-visibility: hidden;
    }

    &.sub-list-enter,
    &.sub-list-leave-to {
      opacity: 0;
      max-height: 0;
    }
  }
}
</style>
