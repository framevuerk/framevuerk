<template lang="pug">
span
  h3(v-if="title", v-html="title")
  h3(v-else) Code:
  .doc-code(v-if="$slots.default")
    pre(v-highlightjs)
      code(:class="lang", class="code")
        span(@click="copyCode", class="copy-code-btn") Copy
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
    user-select: text;
  }

  .code {
    position: relative;
  }
  .copy-code-btn {
    position: absolute;
    right: 0px;
    top: 0;
    padding: 6px 0;
    background: #606060;
    color: #fff;
    border-bottom-left-radius: 4px;
    width: 84px;
    text-align: center;
    cursor: pointer;
  }
}
</style>
