<template lang="pug">
.fv-main
  slot
</template>

<style lang="scss">
// style packages that affect to output
@import '../styles/reset';
@import '../styles/global';
@import '../styles/grid';
@import '../styles/sizes';
@import '../styles/helper';
// helper packages used in .fv-main css props
@import '../styles/variables';
@import '../styles/mixins';

.fv-main {
  background: var(--colors-background-normal);
  color: var(--colors-background-text);

  display: flex;
  flex-direction: row;
  overflow: auto;
  min-height: 100%;

  &.column {
    flex-direction: column;
  }
}
</style>
