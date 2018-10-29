<template lang="pug">
fv-slider.fv-img(v-model="value",
  :interval="interval",
  :show-tabs="false",
  :show-buttons="showButtons && imgs.length > 1",
  :show-navs="imgs.length > 1")
  img.img(v-for="(img, i) in imgs",
    draggable="false",
    :src="img",
    :alt="altOf(i)",
    :slot="'slide-' + img")
</template>

<script>
export default {
  props: {
    src: {
      type: [Array, String],
      default: () => []
    },
    alt: {
      type: [Array, String],
      default: () => []
    },
    showButtons: {
      type: Boolean,
      default: true
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
    imgs () {
      return typeof this.src === 'string' ? [this.src] : this.src
    }
  },
  methods: {
    altOf (index) {
      if (typeof this.alt === 'undefined') {
        return this.imgs[index]
      } else {
        if (this.alt instanceof Array) {
          if (typeof this.alt[index] !== 'undefined') {
            return this.alt[index]
          } else {
            return this.alt.length > 0 ? this.alt[0] : this.imgs
          }
        } else {
          return this.alt
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '../styles/functions';

.fv-img {
  & .slider-page {
    margin-bottom: -6px;
    min-height: heightSize(md);
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
