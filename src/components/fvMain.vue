<template lang="pug">
.fv-main(:style="{paddingLeft: offset.left, paddingRight: offset.right}")
  slot
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
