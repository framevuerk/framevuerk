<template>
  <div class="fv-border fv-shadow fv-radius fv-margin-top fv-margin-bottom">
    <fvMain style="overflow: visible">
      <fvContent style="overflow: visible">
        <div class="fv-text-end fv-margin" v-if="dir">
          <a class="fv-link" :href="sourceLink" target="_blank">
            <i class="fa fa-code"></i>
            View Source
          </a>
        </div>
        <div class="fv-padding-top fv-padding-bottom">
          <slot></slot>
        </div>
      </fvContent>
    </fvMain>
  </div>
</template>

<script>
export default {
  props: {
    dir: {
      type: String
    }
  },
  computed: {
    sourceLink () {
      return `${this.$root.githubDocsRepo}/blob/master/${this.dir}`
    }
  }
}
</script>

<style lang="scss">

</style>
