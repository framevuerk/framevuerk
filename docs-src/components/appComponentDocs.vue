<template>
  <div>
    <div v-if="codes.length > 0">
      <div
        v-for="(code, i) in codes"
        :key="'example' + i"
        css-border="md"
        css-radius="md"
        css-color="background"
        css-margin-bottom="lg"
        css-overflow="hidden"
      >
        <appCode
          :content="code"
          lang="html"
          css-padding="md"
          css-color="sidebar"
        />
        <component
          :is="'example' + i"
          :ref="'example' + i"
        />
      </div>
    </div>

    <div>
      <fvSlider :current.sync="apiSliderValue">
        <fvSlideLabel slot="label" name="props"> Props </fvSlideLabel>
        <fvSlideLabel slot="label" name="events"> Events </fvSlideLabel>
        <fvSlideLabel slot="label" name="slots"> Slots </fvSlideLabel>

        <fvSlideContent slot="content" name="props">
          <fvTable :fields="['name', 'type', 'default', 'description']" :rows="api.props" />
        </fvSlideContent>
        <fvSlideContent slot="content" name="events">
          <fvTable :fields="['name', 'params', 'description']" :rows="api.events">
            <template slot="field-params" slot-scope="scope">
              ({{typeof scope.row.params === 'string' ? scope.row.params : scope.row.params.join(', ')}})
            </template>
          </fvTable>
        </fvSlideContent>
        <fvSlideContent slot="content" name="slots">
          <fvTable :fields="['name', 'scoped', 'binding', 'description']" :rows="api.slots">
            <template slot="field-scoped" slot-scope="scope">
              <div>
                <i v-if="scope.row.scope" class="fa fa-check" css-text-color="success" />
                <i v-else class="fa fa-times" css-text-color="gray" />
              </div>
            </template>
            <template slot="field-binding" slot-scope="scope">
              <div>
                {{scope.row.scope}}
              </div>
            </template>
          </fvTable>
        </fvSlideContent>
        <fvSlideContent slot="content" name="content"> {{ api }} </fvSlideContent>
      </fvSlider>
    </div>
  </div>
</template>

<script>
import { dashCase } from 'framevuerk/utility/utils.js';
import appCode from './appCode.vue';

const defaultComponent = { template: '<div>#</div>' };
const preRegisteredExamples = {};
for (let i = 0; i < 12; i++) {
  preRegisteredExamples[`example${i}`] = defaultComponent;
}

export default {
  components: {
    appCode,
    ...preRegisteredExamples,
    // ...(new Array(10).fill({ template: '<div>#</div>' })),
  },
  props: {
    framevuerkComponent: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      apiSliderValue: 'props',
      codes: [],
      api: {},
    };
  },
  watch: {
    // eslint-disable-next-line object-shorthand
    '$route.params.component'(newComponent) {
      this.$nextTick(() => {
        this.loadData(newComponent);
      });
    },
  },
  created() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  methods: {
    loadData() {
      const component = this.framevuerkComponent;

      this.api = component.__api ? JSON.parse(JSON.stringify(component.__api)) : {};

      component.__examples.forEach((example, index) => {
        this.$options.components[`example${index}`] = {
          template: `
            <div css-color="background" css-overflow="hidden">
              ${example.configs.state !== false ? `
                <div css-padding="lg" css-color="sidebar">
                  <label css-display="block" css-text-color="gray"> Current State: </label>
                  <pre>{{ $data }}</pre>
                </div>
              ` : ''}
              ${example.configs.example !== false ? `
                <div css-padding="md">
                  ${example.template}
                </div>
              ` : ''}
            </div>
          `,
          data() {
            return example.data;
          },
        };
        this.codes.push(example.template);
      });

      this.$forceUpdate();
    },
  },
};
</script>
