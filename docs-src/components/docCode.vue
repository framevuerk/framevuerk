<template lang="pug">
span
  h3(v-if="title", v-html="title")
  h3(v-else) Code:
  .doc-code(v-if="$slots.default")
    pre(v-highlightjs, class="markup")
      span(@click="copyMarkup", class="copy-markup-btn") Copy
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
  },
  methods: {
    copyMarkup (event) {
      let button = event.target
      let markup = button.nextSibling
      markup.setAttribute('contenteditable', 'true')
      markup.focus()
      document.execCommand('selectAll', false, null)
      document.execCommand('copy')
      markup.removeAttribute('contenteditable')
      window.getSelection().removeAllRanges()

      button.textContent = 'Copied'
      setTimeout(function () {
        button.textContent = 'Copy'
      }, 1500)
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

  .markup {
    position: relative;
  }

  .copy-markup-btn {
    position: absolute;
    right: 0;
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
