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
      offset: {
        left: 0,
        right: 0
      }
    }
  },
  methods: {
    getSize () {
      return utility.viewportSize(this.$el)
    },
    appendChild (el) {
      this.$el.appendChild(el)
    },
    appendOverlay (beforeEl, onClick) {
      const overlayElement = document.createElement('div')
      overlayElement.classList.add('fv-overlay')
      overlayElement.addEventListener('click', onClick)
      this.$el.insertBefore(overlayElement, beforeEl)
      return overlayElement
    }
  },
  created () {
    if (this.parent) {
      this._provided = {
        fvMain: this
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
  max-height: 100%;
  overflow: hidden;
  position: relative;
}
</style>
