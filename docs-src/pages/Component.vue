<template>
  <fvLayout>
    <appHeader
      slot="header"
      :title="'Framevuerk - ' + title"
    />
    <appSidebar slot="start-sidebar" />
    <fvContent slot="content">
      <div
        css-max-width="md"
        css-padding="lg"
        css-margin-x="auto"
      >
        <appComponentDocs
          v-if="!loading"
          :framevuerk-component="framevuerkComponent"
        />
      </div>
    </fvContent>
    <appFooter slot="footer" />
  </fvLayout>
</template>

<script>
import * as Framevuerk from 'framevuerk';
import { dashCase } from 'framevuerk/utility/utils.js';
import appHeader from '../components/appHeader.vue';
import appFooter from '../components/appFooter.vue';
import appSidebar from '../components/appSidebar.vue';
import appComponentDocs from '../components/appComponentDocs.vue';

function textAsTitle(text) {
  return text[0].toUpperCase() + text.substr(1).toLowerCase();
}
function textToLower(text) {
  return text.toLowerCase();
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
    };
  },
  watch: {
    '$route.params.component': function (framevuerkComponent) {
      this.loadData(framevuerkComponent);
    },
  },
  created() {
    this.loadData(this.$route.params.component);
  },
  methods: {
    loadData(framevuerkComponent) {
      this.loading = true;
      this.title = textAsTitle(framevuerkComponent);
      // console.log(Framevuerk[this.title].__api.props[0].type);
      this.framevuerkComponent = Framevuerk[this.title];
      this.$nextTick(() => {
        this.loading = false;
      });
    },
  },
};
</script>
