<template lang="pug">
fv-slider.fv-img(v-model="value",
  :interval="interval",
  :show-tabs="false",
  :show-buttons="showButtons && imgs.length > 1",
  :show-navs="imgs.length > 1")
  fv-slide(v-for="(img, i) in imgs",
    :key="'slide-' + img")
    img.img(
      draggable="false",
      :src="img",
      :alt="altOf(i)")
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
  & .fv-slide {
    min-height: heightSize(md);
    margin-bottom: -8px;
  }

  & .img {
    pointer-events: none;
    width: 100%;
  }
}
</style>
