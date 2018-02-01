<template lang="pug">
span
  h3(v-if="title", v-html="title")
  h3(v-else) Code:
  .doc-code(v-if="$slots.default")
    pre(v-highlightjs)
      code(:class="lang")
        slot
  div(v-else)
    p.fv-text-center Nothing to show!
  br
</template>

<script>
export default {
  data () {
    return {
      highlightjs: '',
      v: ''
    }
  },
  props: {
    title: String,
    lang: {
      type: String,
      default: 'html'
    }
  }
}
</script>

<style lang="scss">
body .doc-code {
  & > pre > code {
    padding: 15px;
  }

  &,
  & * {
    user-select: auto;
  }
}
</style>
