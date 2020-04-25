<template>
  <div
    :class="$style.markup"
    css-color="background"
    css-overflow="hidden"
  >
    <pre
      v-highlightjs
      class="markup"
    >
      <!-- <div class="panel" css-padding="md" css-color="sidebar">
        <span class="hljs-comment" v-text="langText"></span>
        <fvButton css-size="sm" css-color="sidebar" css-shadow="no" @click.prevent="copy" :disabled="copiedToast"><i class="fa fa-copy"></i> Copy</fvButton>
      </div> -->
      <code
ref="markup"
:class="lang"
v-text="content.trim()"
/>
      <!-- <fvToast v-model="copiedToast" :timeout="1200">Copied to Clipboard!</fvToast> -->
    </pre>
  </div>
</template>

<script>
export default {
  props: {
    lang: {
      type: String,
      default: 'html',
    },
    content: {
      default: '',
    },
  },
  data() {
    return {
      highlightjs: '',
      v: '',
      copiedToast: false,
    };
  },
  computed: {
    langText() {
      switch (this.lang) {
        case 'html':
          return 'HTML';
        case 'terminal':
          return 'Terminal';
        case 'javascript': case 'js':
          return 'Javascript';
        case 'json':
          return 'JSON';
      }
    },
  },
  methods: {
    copy() {
      const { markup } = this.$refs;
      markup.setAttribute('contenteditable', 'true');
      markup.focus();
      document.execCommand('selectAll', false, null);
      document.execCommand('copy');
      markup.removeAttribute('contenteditable');
      window.getSelection().removeAllRanges();
      this.copiedToast = true;
    },
  },
  style({ className }) {
    return [className('markup', {
      position: 'relative',
      overflow: 'hidden',
      '& pre': {
        whiteSpace: 'normal',
      },
      '& code': {
        whiteSpace: 'pre-wrap',
        fontFamily: 'monospace',
      },
    })];
  },
};
</script>
