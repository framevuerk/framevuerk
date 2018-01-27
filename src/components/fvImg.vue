<template lang="pug">
fv-slider.fv-img(v-model="value",
  :interval="interval",
  :show-tabs="false",
  :show-buttons="showButtons && images.length > 1",
  :show-navs="images.length > 1")
  img.img(v-for="image in images",
    draggable="false",
    :src="image",
    alt="fv-img",
    :slot="image")
</template>

<script>
import fvSlider from './fvSlider.vue'

export default {
  components: {
    fvSlider
  },
  props: {
    src: {
      type: [Array, String],
      default: () => []
    },
    showButtons: {
      type: Boolean,
      default: false
    },
    interval: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      value: undefined
    }
  },
  computed: {
    images () {
      if (typeof this.src === 'string') {
        return [this.src]
      }
      return this.src
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.fv-img {
  background: $color;

  & .fv-slider-page {
    margin-bottom: -6px;
  }

  & .img {
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    margin: 0 auto;
    pointer-events: none;
    user-select: none;
    width: 100%;
  }
}
</style>
