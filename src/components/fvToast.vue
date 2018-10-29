<template lang="pug">
transition(name="fv-toast")
  .fv-toast(v-if="value",
    @click="close")
    slot
</template>

<script>
import utility from '../utility'

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    timeout: {
      type: Number,
      default: 3000
    }
  },
  inject: ['fvMain'],
  data () {
    return {
      timer: null
    }
  },
  methods: {
    onOpen () {
      this.$emit('open')
      this.fvMain.appendChild(this.$el)
      if (this.timeout > 0) {
        this.timer = setTimeout(this.close, this.timeout)
      }
    },
    onClose () {
      this.$emit('close')
      clearTimeout(this.timer)
    },
    close () {
      this.$emit('input', false)
    },
    valueHandler (value) {
      if (value) {
        return this.onOpen()
      }
      return this.onClose()
    }
  },
  created () {
    if (!this.fvMain) {
      throw utility.error('no_fvmain_parent')
    }
  },
  watch: {
    value (value) {
      this.valueHandler(value)
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';
@import '../styles/mixins';

.fv-toast {
  @include yiq($sidebar-bg-color);

  backface-visibility: hidden;
  border-radius: $border-radius $border-radius 0 0;
  bottom: 0;
  font-size: fontSize(lg);
  left: 50%;
  max-width: 100%;
  min-width: 100px;
  padding: ($padding / 2) $padding;
  position: absolute;
  text-align: center;
  transform: translate3d(-50%, 0, 0);
  width: auto;
  z-index: 3;

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
