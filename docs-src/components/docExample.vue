<template lang="pug">
span(v-show="$slots.default")
  .fv-row.fv-no-padding
    h3.fv-no-padding.fv-col.fv-text-left Example(s):
    =" "
    a.fv-no-padding.fv-col.fv-text-right.fv-link(v-if="$slots.default",
      :href="$root.githubRepo + '/tree/master/docs-src/pages/component_' + $route.name",
      target="_blank",
      :title="$route.name + ' source code on GitHub'") View Source
  .doc-example(v-if="$slots.default")
    fv-main
      slot
  div(v-else)
    p.fv-text-center Not Available
  br
</template>

<style lang="scss">
body .doc-example {
  border: solid 1px rgba(0, 0, 0, 0.19);
  overflow: hidden;

  h4 {
    margin-bottom: 4px;
  }
}
</style>
