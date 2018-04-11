<template lang="pug">
.fv-avatar(:style="{width: size, height: size, fontSize: size}")
  .text(:style="{lineHeight: size}") {{text}}
  .image(v-if="backgroundImage", :style="{backgroundImage: backgroundImage}")
</template>

<script>
export default {
  props: {
    src: {
      type: String
    },
    name: {
      type: String
    },
    size: {
      type: String,
      default: '32px'
    }
  },
  computed: {
    text () {
      var trimed = (this.name || '').trim()
      var ret = ''
      const charUpper = (str, at) => str.charAt(at).toUpperCase()
      if (trimed) {
        if (trimed.indexOf(' ') !== -1) {
          ret = charUpper(trimed, 0) + charUpper(trimed, trimed.lastIndexOf(' ') + 1)
        } else if (trimed.length >= 2) {
          ret = charUpper(trimed, 0) + charUpper(trimed, 1)
        } else {
          ret = charUpper(trimed, 0).repeat(2)
        }
      } else {
        return 'XX'
      }
      return ret
    },
    backgroundImage () {
      return this.src ? `url("${this.src}")` : false
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';

.fv-avatar {
  @include yiq($bg-color-light);
  @include shadow(bottom);

  display: inline-block;
  width: 32px;
  height: 32px;
  border: 1px solid darken($bg-color-light, $shadow-percent);
  border-radius: 100%;
  position: relative;
  overflow: hidden;

  & > .image {
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  & > .text {
    width: 100%;
    height: 100%;
    position: absolute;
    text-align: center;
    font-size: 0.4em;
    font-weight: bold;
  }
}
</style>
