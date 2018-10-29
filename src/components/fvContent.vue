<template lang="pug">
.fv-content
  slot
</template>

<script>
export default {
  props: {
    initialScroll: {
      type: Number,
      default: 0
    }
  },
  mounted () {
    this.$el.style.opacity = 0
    setTimeout(() => {
      if (this.initialScroll) {
        this.$el.style.opacity = 0
        this.$nextTick(() => {
          setTimeout(() => {
            this.$el.scrollTop = this.initialScroll
            this.$el.style.opacity = 1
          })
        })
      } else {
        this.$el.style.opacity = 1
      }
    })
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-content {
  @include scrollbar($bg-color);

  display: block;
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  max-width: 100%;
  transition: opacity 0.1s;

  &::after {
    clear: both;
    content: '';
    display: block;
  }
}
</style>
