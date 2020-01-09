<template>
<fvLayout>
  <appHeader title="Get Started" slot="header" />
  <appSidebar slot="start-sidebar"/>
  <fvContent slot="content">
    <div css-max-width="md" css-padding-y="xl" css-padding-x="md"  css-margin-x="auto">
      <h2 css-text-size="xl"> How to Install </h2>
    </div>
  </fvContent>
  <appFooter slot="footer" />
</fvLayout>
</template>

<script>
import appHeader from '../components/appHeader.vue';
import appFooter from '../components/appFooter.vue';
import appSidebar from '../components/appSidebar.vue';

export default {
  components: {
    appHeader,
    appFooter,
    appSidebar,
  },
}
</script>