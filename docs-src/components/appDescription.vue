<template>
<p v-if="content.description" v-html="content.description" css-margin-y="md"></p>
<p v-else css-margin-y="md" css-padding="md"><slot /></p>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => ({ description: null })
    }
  }
}
</script>