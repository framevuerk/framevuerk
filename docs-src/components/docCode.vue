<template lang="pug">
.fv-row.bg-2
  div(:class="$root.mainClass")
    div
    h3(v-if="title", v-text="title + ':'")
    h3(v-else) Code:
    p.fv-control-label(v-if="description", v-html="description")
    .doc-code.fv-border.fv-radius.fv-shadow(v-if="$slots.default")
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
    description: String,
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
    user-select: text;
  }
}
</style>
