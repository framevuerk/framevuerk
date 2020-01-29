<template>
<fvLayout>
  <appHeader :title="'Framevuerk - ' + title" slot="header" />
  <appSidebar slot="start-sidebar"/>
  <fvContent slot="content">
    <div css-max-width="md" css-padding-y="xl" css-padding-x="md"  css-margin-x="auto">
      <appComponentDocs v-if="!loading" :framevuerkComponent="framevuerkComponent" />
    </div>
  </fvContent>
  <appFooter slot="footer" />
</fvLayout>
</template>

<script>
import appHeader from '../components/appHeader.vue';
import appFooter from '../components/appFooter.vue';
import appSidebar from '../components/appSidebar.vue';
import appComponentDocs from '../components/appComponentDocs.vue';
import * as Framevuerk from 'framevuerk';
import { dashCase } from 'framevuerk/utility/utils.js';

function textAsTitle(text) {
  return text[0].toUpperCase() + text.substr(1).toLowerCase()
}
function textToLower(text) {
  return text.toLowerCase()
}

export default {
  components: {
    appHeader,
    appFooter,
    appSidebar,
    appComponentDocs,
  },
  data() {
    return {
      loading: true,
      title: undefined,
      framevuerkComponent: undefined,
    }
  },
  created() {
    this.loadData(this.$route.params.component);
  },
  methods: {
    loadData(framevuerkComponent) {
      this.loading = true;
      this.title = textAsTitle(framevuerkComponent);
      this.framevuerkComponent = Framevuerk[this.title];
      this.$nextTick(() => {
        this.loading = false;
      });
    },
  },
  watch: {
    '$route.params.component'(framevuerkComponent) {
      this.loadData(framevuerkComponent);
    }
  }
}
</script>