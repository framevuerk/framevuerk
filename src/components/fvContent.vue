<template lang="pug">
.fv-content
  slot
</template>

<style lang="scss">
.fv-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  max-width: 100%;
  min-height: 100%;
  justify-content: stretch;

  & > *:not(.fv-header):not(.fv-footer):not(.not-content) {
    flex-grow: 1;
  }
}
</style>
