<template lang="pug">
.fv-row.doc-features.bg-5
  div(:class="$root.mainClass")
    .fv-no-padding
      h3.fv-no-padding.fv-text-left Feature(s):
    .doc-features.fv-border.fv-radius.fv-shadow
      ul
        li(v-for="feature in features", :key="feature", v-html="feature")
  br
</template>

<script>
export default {
  props: {
    features: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss">
body .doc-features {
  & ul {
    font-size: 1em;
    font-weight: bold;
    padding: 15px;
    list-style-type: disc;
    list-style-position: inside;

    & li {
      padding: 5px;
    }
  }
}
</style>
