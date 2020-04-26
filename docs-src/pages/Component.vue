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

      let componentName = '';
      let nextUpper = true;
      for (let i = 0; i < framevuerkComponent.length; i++) {
        if (framevuerkComponent[i] === '-') {
          nextUpper = true;
        } else if (nextUpper) {
          componentName += framevuerkComponent[i].toUpperCase();
          nextUpper = false;
        } else {
          componentName += framevuerkComponent[i].toLowerCase();
        }
      }

      this.title = componentName;

      this.framevuerkComponent = Framevuerk[this.title];
      this.$nextTick(() => {
        this.loading = false;
      });
    },
  },
};
</script>
