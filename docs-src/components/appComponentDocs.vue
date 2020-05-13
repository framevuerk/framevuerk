<template>
  <div>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <p v-html="api.doc && api.doc.length ? api.doc[0].description : ''" css-margin-bottom="lg" />
    <div v-if="codes.length > 0">
      <div
        v-for="(code, i) in codes"
        :key="'example' + i"
        css-border="md"
        css-radius="md"
        css-color="background"
        css-margin-bottom="lg"
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
          <fvTable>
            <fvTableField slot="th" name="name"> Name </fvTableField>
            <fvTableField slot="th" name="type"> Type </fvTableField>
            <fvTableField slot="th" name="default"> Default </fvTableField>
            <fvTableField slot="th" name="description"> Description </fvTableField>
            <fvTableRow
              v-for="row in api.props"
              :key="row.name"
              slot="tr"
            >
              <fvTableField slot="td" name="name"> {{ row.name }} </fvTableField>
              <fvTableField slot="td" name="type"> {{ row.type }} </fvTableField>
              <fvTableField slot="td" name="default"> {{ row.default }} </fvTableField>
              <fvTableField slot="td" name="description"> {{ row.description }} </fvTableField>
            </fvTableRow>
          </fvTable>
        </fvSlideContent>
        <fvSlideContent slot="content" name="events">
          <fvTable>
            <fvTableField slot="th" name="name"> Name </fvTableField>
            <fvTableField slot="th" name="args"> Arguments </fvTableField>
            <fvTableField slot="th" name="description"> Description </fvTableField>
            <fvTableRow
              v-for="row in api.events"
              :key="row.name"
              slot="tr"
            >
              <fvTableField slot="td" name="name"> {{ row.name }} </fvTableField>
              <fvTableField slot="td" name="args">
                <i v-if="!row.params" class="fa fa-times" css-text-color="gray" />
                <div v-else>
                  ({{typeof row.params !== 'object' ? row.params : row.params.join(', ')}})
                </div>
              </fvTableField>
              <fvTableField slot="td" name="description"> {{ row.description }} </fvTableField>
            </fvTableRow>
          </fvTable>
        </fvSlideContent>
        <fvSlideContent slot="content" name="slots">
          <fvTable>
            <fvTableField slot="th" name="name"> Name </fvTableField>
            <fvTableField slot="th" name="binding"> Slot Scope </fvTableField>
            <fvTableField slot="th" name="description"> Description </fvTableField>
            <fvTableRow
              v-for="row in api.slots"
              :key="row.name"
              slot="tr"
            >
              <fvTableField slot="td" name="name"> {{ row.name }} </fvTableField>
              <fvTableField slot="td" name="binding">
                <i v-if="!row.params" class="fa fa-times" css-text-color="gray" />
                <div v-else>
                  {<span>{{typeof row.params !== 'object' ? row.params : row.params.join(', ')}}</span>}
                </div>
              </fvTableField>
              <fvTableField slot="td" name="description"> {{ row.description }} </fvTableField>
            </fvTableRow>
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

      (component.__examples || []).forEach((example, index) => {
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
