<template>
<fvLayout>
  <appHeader :title="'Framevuerk - ' + api.displayName" slot="header" />
  <appSidebar slot="start-sidebar"/>
  <fvContent slot="content">
    <div css-max-width="md" css-padding-y="xl" css-padding-x="md"  css-margin-x="auto">
      <h2 css-text-size="xl"> Code </h2>
      <div css-border="md" css-shadow="md" css-radius="md" css-padding="md" css-color="sidebar">
        <div v-text="code" />
      </div>
      <div css-margin-y="lg" />
      <h2 css-text-size="xl"> Example </h2>
      <div css-border="md" css-shadow="md" css-radius="md" css-padding="md" css-color="background">
        <component :is="example" />
      </div>
      <h2 css-text-size="xl"> API </h2>
      <div css-border="md" css-shadow="md" css-radius="md" css-padding="md" css-color="background">
        <fvSlider :current.sync="apiSliderValue">
          <fvSlide slot="slide" name="props">
            <fvTable :fields="['name', 'type', 'defaultValue']" :rows="api.props" />
          </fvSlide>
          <fvSlide slot="slide" name="amir2">Amir2<br>^%%$^%<br>$$%$^</fvSlide>
          <fvSlide slot="slide" name="amir3">Amir3<br>12321<br>312312</fvSlide>
          <fvSlide slot="slide" name="amir4">Amir4<br>Salamcs<br>acsac</fvSlide>
        </fvSlider>
      </div>
      {{ api }}
      
    </div>
  </fvContent>
  <appFooter slot="footer" />
</fvLayout>
</template>

<script>
import appHeader from '../components/appHeader.vue';
import appFooter from '../components/appFooter.vue';
import appSidebar from '../components/appSidebar.vue';
import * as Framevuerk from 'framevuerk';

function textAsTitle(text) {
  return text[0].toUpperCase() + text.substr(1).toLowerCase()
}
function textToLower(text) {
  return text.toLowerCase()
}

function LoadComponent(name, part = null) {
  const res = Framevuerk[textAsTitle(name)];
  return part ? res[part] : res;
}

function componentsExample() {
  const ret = {};
  Object.keys(Framevuerk).filter((x) => x && !['default', 'name', 'version'].includes(x)).forEach((component) => {
    ret[textToLower(component) + 'Example'] = Framevuerk[component].__example || { template: '<div> No Example </div>' };
  });
  return ret;
}

export default {
  components: {
    appHeader,
    appFooter,
    appSidebar,
    ...componentsExample(),
  },
  data() {
    return {
      code: '',
      api: {},
      apiSliderValue: undefined,
    }
  },
  created() {
    this.loadData(this.$route.params.component);
  },
  methods: {
    loadData(component) {
      this.code = Framevuerk[textAsTitle(component)].__exampleSource
      this.api = Framevuerk[textAsTitle(component)].__api
    }
  },
  computed: {
    example() {
      return textToLower(this.$route.params.component) + 'Example';
    },
  },
  watch: {
    '$route.params.component'(newComponent) {
      this.loadData(newComponent);
    }
  }
}
</script>