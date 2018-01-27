<template lang="pug">
transition(name="fv-toast")
  .fv-toast(v-if="visible",
    v-html="text",
    @click="hide")
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      text: null,
      timer: null
    }
  },
  methods: {
    show (text = null, timeout = 5500) {
      this.hide()
      if (!this.$parent) {
        this.$mount()
        document.body.appendChild(this.$el)
      }
      this.visible = true
      this.text = text
      this.timer = setTimeout(() => {
        this.visible = false
      }, timeout)
    },
    hide () {
      this.visible = false
      clearTimeout(this.timer)
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-toast {
  @include yiq($night-bg-color);

  backface-visibility: hidden;
  border-radius: $border-radius $border-radius 0 0;
  bottom: 0;
  font-size: 1.1em;
  left: 50%;
  max-width: 100%;
  min-width: 100px;
  padding: ($padding / 2) $padding;
  position: absolute;
  text-align: center;
  transform: translate3d(-50%, 0, 0);
  width: auto;

  &.fv-toast-enter-active,
  &.fv-toast-leave-active {
    transform: translate3d(-50%, 0 0);
    transition-duration: $transition-speed;
    transition-property: transform;
    will-change: transform;
  }

  &.fv-toast-enter,
  &.fv-toast-leave-to {
    transform: translate3d(-50%, 100%, 0);
  }
}
</style>
