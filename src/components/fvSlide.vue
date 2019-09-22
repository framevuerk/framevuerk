<template lang="pug">
.fv-slide
  slot
</template>

<script>
import icon from '../icons/ARR.svg'
import parent from '../utility/parent.js'

export default {
  props: {
    value: {
      required: true
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.fv-slide {
  padding: 0;
  overflow-x: hidden;
  display: inline-block;
  vertical-align: top;
  user-select: none;
  margin: 0;
}

</style>
