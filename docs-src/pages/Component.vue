<template>
  <fvLayout>
    <!-- <span slot="x"></span> -->
    <appHeader title="Framevuerk" slot="header">
      <fvButton tag="router-link" to="/installation/setup" css-color="header" css-border="no" css-shadow="no">
        Documentions
      </fvButton>
    </appHeader>
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
      </div>
    </fvContent>
    <fvFooter slot="footer" css-padding="lg" css-text-align="center" cssz-color="background"> Released under the MIT License Copyright © 2016-{{new Date().getFullYear()}} Amir Momenian. </fvFooter>
  </fvLayout>
</template>

<script>
import appHeader from '../components/appHeader.vue';

function textAsTitle(text) {
  return text[0].toUpperCase() + text.substr(1).toLowerCase()
}
function textToLower(text) {
  return text.toLowerCase()
}

function LoadComponent(name, part) {
  return new Promise((resolve) => {
    import('framevuerk').then((Framevuerk) => {
      const res = Framevuerk[textAsTitle(name)][part];
      resolve(res);
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
    ...componentsExample([
      'footer',
      'header',
    ]),
  },
  data() {
    return {
      exampleSourceCode: '',
    }
  },
  created() {
    LoadComponent(this.$route.params.component, '__exampleSource').then((res) => {
      this.exampleSourceCode = res;
    });
  },
  computed: {
    componentExample() {
      return textToLower(this.$route.params.component) + 'Example';
    },
  },
}
</script>