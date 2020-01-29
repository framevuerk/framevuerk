<template>
  <div>
    <div v-if="codes.length > 0">
      <div v-for="(code, i) in codes" :key="'example' + i">
        <appCode :content="code" lang="html" css-padding="md" css-color="sidebar" />
        <component :is="'example' + i" />
      </div>
    </div>
    <div>
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
</template>

<script>
import appCode from '../components/appCode.vue';
import { dashCase } from 'framevuerk/utility/utils.js';

const defaultComponent = { template: '<div>#</div>' };
const preRegisteredExamples = {};
for(let i = 0; i < 12; i++) {
  preRegisteredExamples[`example${i}`] = defaultComponent;
}

export default {
  components: {
    appCode,
    ...preRegisteredExamples
  },
  props: {
    framevuerkComponent: {
      required: true,
    },
  },
  data() {
    return {
      apiSliderValue: 'content',
      codes: [],
      api: {},
    }
  },
  created() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  methods: {
    loadData() {
      const component = this.framevuerkComponent;
      const examples = component.__examples || [];
      examples.forEach((example, index) => {
        this.$options.components[`example${index}`] = {
          template: `
            <div>
              ${!example.config.hideState && `
                <div css-padding="md" css-color="sidebar">
                  <label css-display="block" css-text-color="gray"> Current State: </label>
                  <pre>{{ $data }}</pre>
                </div>
              `}
              <div css-padding="md">
                ${example.code}
              </div>
            </div>
          `,
          data() {
            return example.data;
          },
        };
        this.codes.push(example.code);
      });

    
      this.api = component.__api;

      // cleanup api
      const props = this.api.props || [];
      props.forEach((prop) => {
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
      this.$forceUpdate();
    },
  },
  watch: {
    '$route.params.component'(newComponent) {
      this.loadData(newComponent);
    }
  }
}
</script>