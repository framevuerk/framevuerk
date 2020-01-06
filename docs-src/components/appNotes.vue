<template>
  <div class="fv-border fv-shadow fv-radius fv-margin-top fv-margin-bottom fv-padding notes" v-highlightjs>
    <ul>
      <li v-for="note in content.note" :key="note" v-html="note"></li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
.notes {
  & > ul {
    list-style: lower-roman;
    list-style-position: inside;
  }
}
</style>
