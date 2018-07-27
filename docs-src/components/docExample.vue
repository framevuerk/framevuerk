<template lang="pug">
span(v-show="$slots.default")
  .fv-row.fv-no-padding
    h3.fv-no-padding.fv-col.fv-text-left Example(s):
    =" "
    a.fv-no-padding.fv-col.fv-text-right.fv-link(v-if="$slots.default",
      :href="$root.githubRepo + '/tree/master/docs-src/pages/components/' + $route.name + '.vue'",
      target="_blank",
      :title="$route.name + ' source code on GitHub'") View Source
  .doc-example.fv-border.fv-radius.fv-shadow(v-if="$slots.default")
    fv-main(:parent="parent", :style="{overflow: parent ? 'hidden' : 'auto'}")
      slot
  div(v-else)
    p.fv-text-center Not Available
  br
</template>

<script>
export default {
  props: {
    parent: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
body .doc-example {
  h4 {
    margin-bottom: 4px;
  }
}
</style>
