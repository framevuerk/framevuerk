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
        <component
          :is="'example' + i"
          :ref="'example' + i"
        />
        <appCode
          :content="code"
          lang="html"
          css-padding="md"
          css-color="sidebar"
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
          <fvTable :fields="['name', 'args', 'description']" :rows="api.events">
            <template slot="field-args" slot-scope="scope">
              <i v-if="!scope.row.params" class="fa fa-times" css-text-color="gray" />
              <div v-else>
                ({{typeof scope.row.params !== 'object' ? scope.row.params : scope.row.params.join(', ')}})
              </div>
            </template>
          </fvTable>
        </fvSlideContent>
        <fvSlideContent slot="content" name="slots">
          <fvTable :fields="['name', 'binding', 'description']" :rows="api.slots">
            <template slot="field-binding" slot-scope="scope">
              <i v-if="!scope.row.params" class="fa fa-times" css-text-color="gray" />
              <div v-else>
                {<span>{{typeof scope.row.params !== 'object' ? scope.row.params : scope.row.params.join(', ')}}</span>}
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
            <div css-color="background">
              ${example.configs.example !== false ? `
                <label css-display="block" css-padding="md"> ${example.configs.title || 'Default'} </label>
                <div css-padding="md" css-padding-bottom="lg">
                  ${example.template}
                </div>
              ` : ''}
              ${example.configs.state !== false ? `
                <div css-padding="md" css-color="sidebar" css-cursor="pointer" @click="stateVisibility = true" v-if="!stateVisibility">
                  <pre css-text-color="gray" css-font-size="sm">$data === { ...(click to expand) }</pre>
                </div>
                <div css-padding="md" css-color="sidebar" css-cursor="text" @click="stateVisibility = false" v-else>
                  <pre css-text-color="gray" css-font-size="sm">$data === {{ $data }}</pre>
                </div>
              ` : ''}
            </div>
          `,
          data() {
            return {
              ...example.data,
              stateVisibility: false,
            };
          },
        };
        this.codes.push(example.template);
      });

      this.$forceUpdate();
    },
  },
};
</script>
