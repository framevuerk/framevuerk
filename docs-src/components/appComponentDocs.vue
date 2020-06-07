<template>
  <!-- eslint-disable vue/max-attributes-per-line, vue/no-v-html, vue/singleline-html-element-content-newline  -->
  <div>
    <p css-margin-bottom="lg" v-html="api.doc && api.doc.length ? api.doc[0].description : ''" />
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
          <fvTable v-if="api.props && api.props.length">
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
          <h4 v-else css-text-align="center" css-padding-y="lg">
            <i class="fa fa-info-circle" /> No Props Found for This Component
          </h4>
        </fvSlideContent>
        <fvSlideContent slot="content" name="events">
          <fvTable v-if="api.events && api.events.length">
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
          <h4 v-else css-text-align="center" css-padding-y="lg">
            <i class="fa fa-info-circle" /> No Events Found for This Component
          </h4>
        </fvSlideContent>
        <fvSlideContent slot="content" name="slots">
          <fvTable v-if="api.slots && api.slots.length">
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
          <h4 v-else css-text-align="center" css-padding-y="lg">
            <i class="fa fa-info-circle" /> No Slots Found for This Component
          </h4>
        </fvSlideContent>
      </fvSlider>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle, object-shorthand */
import appCode from './appCode.vue';

const defaultComponent = { template: '<div>#</div>' };
const preRegisteredExamples = {};
for (let i = 0; i < 12; i += 1) {
  preRegisteredExamples[`example${i}`] = defaultComponent;
}

export default {
  components: {
    appCode,
    ...preRegisteredExamples,
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
      window.scrollTo(0, 0);
      this.api = component.__api ? JSON.parse(JSON.stringify(component.__api)) : {};

      this.apiSliderValue = (() => {
        if (this.api.props && this.api.props.length) {
          return 'props';
        }
        if (this.api.events && this.api.events.length) {
          return 'events';
        }
        if (this.api.slots && this.api.slots.length) {
          return 'slots';
        }
        if (this.api.providedProps && this.api.providedProps.length) {
          return 'providedProps';
        }
        return 'props';
      })();

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
