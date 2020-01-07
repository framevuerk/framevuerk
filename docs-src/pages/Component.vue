<template>
  <fvLayout>
    <appHeader title="Framevuerk" slot="header">
      <fvButton tag="router-link" to="/installation/setup" css-color="header" css-border="no" css-shadow="no">
        Documentions
      </fvButton>
    </appHeader>
    <appSidebar slot="start-sidebar"/>
    <fvContent slot="content">
      <div css-max-width="md" css-padding-y="xl" css-padding-x="md"  css-margin-x="auto">
        <h2 css-text-size="xl"> Code </h2>
        <div css-border="md" css-shadow="md" css-radius="md" css-padding="md" css-color="sidebar">
          <div v-text="exampleSourceCode" />
        </div>
        <div css-margin-y="lg" />
        <h2 css-text-size="xl"> Example </h2>
        <div css-border="md" css-shadow="md" css-radius="md" css-padding="md" css-color="background">
          <component :is="componentExample" />
        </div>
        <h2 css-text-size="xl"> API </h2>
        <div css-border="md" css-shadow="md" css-radius="md" css-padding="md" css-color="background">
          <div v-text="componentApi" />
        </div>
        
      </div>
    </fvContent>
    <fvFooter slot="footer" css-padding="lg" css-text-align="center" cssz-color="background"> Released under the MIT License Copyright © 2016-{{new Date().getFullYear()}} Amir Momenian. </fvFooter>
  </fvLayout>
</template>

<script>
import appHeader from '../components/appHeader.vue';
import appSidebar from '../components/appSidebar.vue';

function textAsTitle(text) {
  return text[0].toUpperCase() + text.substr(1).toLowerCase()
}
function textToLower(text) {
  return text.toLowerCase()
}

function LoadComponent(name, part = null) {
  return new Promise((resolve) => {
    import('framevuerk').then((Framevuerk) => {
      const res = Framevuerk[textAsTitle(name)];
      resolve(part ? res[part] : res);
    });
  })
}

function componentsExample(list) {
  const ret = {};
  list.forEach((component) => {
    ret[textToLower(component) + 'Example'] = () => LoadComponent(component, '__example');
  });
  return ret;
}

export default {
  components: {
    appHeader,
    appSidebar,
    ...componentsExample([
      'footer',
      'header',
    ]),
  },
  data() {
    return {
      exampleSourceCode: '',
      componentApi: {},
    }
  },
  created() {
    LoadComponent(this.$route.params.component).then((res) => {
      this.exampleSourceCode = res.__exampleSource;
      this.componentApi = res.__api;
    });
  },
  computed: {
    componentExample() {
      return textToLower(this.$route.params.component) + 'Example';
    },
  },
}
</script>