<template>
<fvLayout>
  <appHeader :title="'Framevuerk - ' + api.displayName" slot="header" />
  <appSidebar slot="start-sidebar"/>
  <fvContent slot="content">
    <div css-max-width="md" css-padding-y="xl" css-padding-x="md"  css-margin-x="auto">
      <div v-if="loaded && this.$data[name + '-example-length'] > 0">
        <div v-for="(e, i) in this.$data[name + '-example-empty-array']" :key="name + i">
          <!-- <h2 css-text-size="xl"> Code </h2> -->
          <div css-radius="md" css-shadow-bottom="md" css-border="md" css-color="background">
            <appCode :content="$data[name + '-code-' + i]" lang="html" css-padding="md" css-color="sidebar" />
            <component :is="name + '-example-' + i" />
          </div>

          <div css-margin-y="lg" />
          <h2 css-text-size="xl"> Example </h2>
          <div css-border="md" css-shadow="md" css-radius="md" css-padding="md" css-color="background">
          </div>
        </div>
      </div>
      <h2 css-text-size="xl"> API </h2>
      <div css-padding="no" css-color="background">
        <fvSlider :current.sync="apiSliderValue">
          <fvSlideLabel slot="label" name="props"> Props </fvSlideLabel>
          <fvSlideLabel slot="label" name="slots"> Slots </fvSlideLabel>

          <fvSlideContent slot="content" name="content"> {{ api }} </fvSlideContent>
          <fvSlideContent slot="content" name="props">
            <fvTable :fields="['name', 'type', 'default', 'description']" :rows="api.props">
            </fvTable>
          </fvSlideContent>
          <fvSlideContent slot="content" name="slots">
            <fvTable :fields="['name', 'scoped', 'bindings', 'description']" :rows="api.slots">
              <template slot="field-scoped" slot-scope="scope">
                <div :css-text-align="scope.type === 'breaked' ? '' : 'center'">
                  <i v-if="scope.row.scoped" class="fa fa-check" css-text-color="success" />
                  <i v-else class="fa fa-times" css-text-color="gray" />
                </div>
              </template>
            </fvTable>
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
import appCode from '../components/appCode.vue';
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
    appCode,
  },
  data() {
    return {
      name: '',
      api: {},
      apiSliderValue: undefined,
      loaded: false,
    }
  },
  created() {
    this.loadData(this.$route.params.component);
  },
  methods: {
    loadData(component) {
      this.$data.loaded = false;
      const title = textAsTitle(component);
      const lower = textToLower(this.$route.params.component);
      const obj = Framevuerk[title];
      const examples = obj.__examples || [];
      examples.forEach((example, index) => {
        this.$options.components[lower + '-example-' + index] = example.component;
        this.$data[lower + '-code-' + index] = example.code;
      });
      this.$data[lower + '-example-length'] = examples.length;
      this.$data[lower + '-example-empty-array'] = new Array(examples.length).fill(null);
      this.$data.api = obj.__api;
      this.$data.api.props.forEach((prop) => {
        // calc name
        let name = dashCase(prop.name);
        if (prop.required) {
          name += '*';
        }
        prop.name = name;
        // calc type
        const type = prop.type.name;
        if (prop.description && prop.description.indexOf('@oneof') !== -1) {
          const str = prop.description.match(/(@oneof)[^)]*\)/g)[0];
          prop.description = prop.description.replace(str, '');
          prop.type = str;
        } else {
          prop.type = type;
        }

        // calc defaultValue
        prop.default = !prop.defaultValue.func ? prop.defaultValue.value : eval(`(${prop.defaultValue.value})()`);
      });
      this.$data.name = lower;
      setTimeout(() => {
        this.$data.loaded = true;
        this.$forceUpdate();
      });
    },
    getPropDefaultValue(str) {
      return eval(`(${str})()`);
    },
  },
  watch: {
    '$route.params.component'(newComponent) {
      this.loadData(newComponent);
    }
  }
}
</script>