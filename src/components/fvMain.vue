<template lang="pug">
.fv-main(:style="{paddingLeft: offset.left, paddingRight: offset.right}", :data-parent="parent")
  slot
</template>

<script>
import utility from '../utility/index.js'

export default {
  props: {
    parent: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      locks: 0,
      offset: {
        left: 0,
        right: 0
      }
    }
  },
  methods: {
    setOffset (position = 'left', size = '0px') {
      this.offset[position] = size
    },
    onRequest (emitterComponent, eventName, eventData) {
      if (eventName === 'setOffset') {
        this.offset[eventData.position] = eventData.size
        return true
      } else if (eventName === 'appendChild') {
        this.$el.appendChild(eventData.el)
        return true
      } else if (eventName === 'appendOverlay') {
        const overlayElement = document.createElement('div')
        overlayElement.classList.add('fv-overlay')
        overlayElement.addEventListener('click', eventData.onClick)
        this.$el.insertBefore(overlayElement, eventData.before)
        return overlayElement
      } else if (eventName === 'getSize') {
        return utility.viewportSize(this.$el)
      } else if (eventName === 'getElement') {
        return this.$el
      }
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-main {
  @include yiq($bg-color);

  direction: $direction;
  display: flex;
  flex-direction: column;
  height: inherit;
  overflow: hidden;
  position: relative;
}
</style>
