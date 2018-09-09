<template lang="pug">
.fv-row.bg-2
  div(:class="$root.mainClass")
    div
    h3(v-if="title", v-text="title + ':'")
    h3(v-else) Code:
    p.fv-control-label(v-if="description", v-html="description")
    .doc-code.fv-border.fv-radius.fv-shadow(v-if="$slots.default")
      pre.markup(v-highlightjs)
        span.copy-markup-btn(@click="copyMarkup") Copy
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

      button.innerHTML = '&#10004;Copied'
      setTimeout(function () {
        button.innerHTML = 'Copy'
      }, 1500)
    }
  }
}
</script>

<style lang="scss">
body .doc-code {
  & > pre > code {
    padding: 15px;
    background: #3a3a3a;
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
