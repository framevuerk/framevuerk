<template lang="pug">
transition(name="fv-toast")
  .fv-toast(v-show="value",
    @click="close")
    slot
</template>

<script>
import parent from '../utility/parent.js';
import colorMixin from '../mixins/color.js';

export default {
  mixins: [
    colorMixin({
      color: 'background',
    }),
  ],
  props: {
    color: {
      type: String,
      default: 'sidebar',
    },
    value: {
      type: Boolean,
      default: false,
    },
    timeout: {
      type: Number,
      default: 3000,
    },
  },
  data() {
    return {
      timer: null,
    };
  },
  watch: {
    value(value) {
      this.valueHandler(value);
    },
  },
  methods: {
    onOpen() {
      this.$emit('open');
      parent.appendChild(this.$el);
      if (this.timeout > 0) {
        this.timer = setTimeout(this.close, this.timeout);
      }
    },
    onClose() {
      this.$emit('close');
      clearTimeout(this.timer);
    },
    close() {
      this.$emit('input', false);
    },
    valueHandler(value) {
      if (value) {
        return this.onOpen();
      }
      return this.onClose();
    },
  },
};
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/functions';
// @import '../styles/mixins';

.fv-toast {
  backface-visibility: hidden;
  border-radius: var(--sizes-radius) var(--sizes-radius)  0 0;
  bottom: 0;
  font-size: fontSize(lg);
  left: 50%;
  max-width: 100%;
  min-width: 100px;
  padding: var(--sizes-space-sm) var(--sizes-space-md);
  position: fixed;
  text-align: center;
  transform: translate3d(-50%, 0, 0);
  background-color: var(--color-normal);
  color: var(--color-text);
  width: auto;
  z-index: 3;

  @media #{$media-lower-sm} {
    width: 100%;
    border-radius: 0;
  }

  &.fv-toast-enter-active,
  &.fv-toast-leave-active {
    transform: translate3d(-50%, 0 0);
    transition-duration: var(--speed-transition-normal);
    transition-property: transform;
    will-change: transform;
  }

  &.fv-toast-enter,
  &.fv-toast-leave-to {
    transform: translate3d(-50%, 100%, 0);
  }
}
</style>
