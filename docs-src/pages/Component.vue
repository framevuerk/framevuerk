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
      <div css-padding="no" css-color="background">
        <fvSlider :current.sync="apiSliderValue">
          <fvSlideLabel slot="label" name="props"> Props </fvSlideLabel>
          <fvSlideLabel slot="label" name="slots"> Slots </fvSlideLabel>
          <fvSlideContent slot="content" name="content"> {{ api }} </fvSlideContent>
          <fvSlideContent slot="content" name="props">
            <fvTable :fields="['name', 'type', 'defaultValue']" :rows="api.props" />
          </fvSlideContent>
          <fvSlideContent slot="content" name="slots">
            <fvTable :fields="['name']" :rows="api.slots" />
          </fvSlideContent>
        </fvSlider>
      </div>
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