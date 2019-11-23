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
import parent from '../utility/parent.js'

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
    subListHeight () {
      let hopeHeight = '100vh'
      if (parent.$body) {
        const tempEl = this.$refs.subList.cloneNode(true)
        tempEl.style.display = 'block'
        tempEl.style.visibility = 'hidden'
        tempEl.style.position = 'absolute'
        tempEl.style.top = '-200vh'
        tempEl.style.height = 'auto'
        parent.$body.appendChild(tempEl)
        hopeHeight = `${tempEl.scrollHeight + 2}px`
        tempEl.remove()
      }
      return hopeHeight
    },
    expand () {
      this.$refs.subList.style.maxHeight = this.subListHeight()
      setTimeout(() => {
        this.isExpanded = true
        this.$emit('expand')
      })
    },
    collapse () {
      this.$refs.subList.style.maxHeight = this.subListHeight()
      setTimeout(() => {
        this.isExpanded = false
        this.$emit('collapse')
      })
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
    cursor: default;

    & > .text {
      @include nowrap;

      flex-grow: 1;
      padding: 0 var(--size-padding-normal);
    }

    & .expand {
      padding: 0 var(--size-padding-small);
      cursor: pointer;

      & > svg {
        vertical-align: middle;
        width: 1.4em;
        height: auto;
        transition: transform var(--speed-transition-normal);
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
    border-top: solid 1px var(--color-border);
  }

  &[disabled] {
    & > .content {
      @include disabled(true);
    }
  }

  &.highlighted > .content {
    background: var(--color-hover);
    color: var(--color-text);
  }

  &.selected {
    border-#{$block-start}: solid 4px var(--activeColor-normal);
  }

  & .sub-list {
    & > .fv-list {
      border: 0;
      & > .fv-list-item > .content{
        padding-#{$block-start}: 2.5em;
      }
    }

    &.sub-list-enter-active,
    &.sub-list-leave-active {
      transition-duration: var(--speed-transition-normal);
      transition-property: opacity, max-height, transform;
      will-change: opacity, max-height, transform;
      // max-height: 100vh;
      backface-visibility: hidden;
    }

    &.sub-list-enter,
    &.sub-list-leave-to {
      // opacity: 0;
      max-height: 0 !important;
      // opacity: 0;
    }
  }
}
</style>
