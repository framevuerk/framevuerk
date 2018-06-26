<template lang="pug">
.fv-main
  slot
  transition(name="fv-fade")
    .fv-overlay(v-if="isLocked", @click="$emit('overlay-click', $event)")
</template>

<script>
export default {
  props: {
    parent: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isLocked: false
    }
  },
  methods: {
    lock () {
      this.isLocked = true
    },
    unlock () {
      this.isLocked = false
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
  position: relative;
  // width: inherit;
}
</style>
