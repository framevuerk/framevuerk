<template>
  <div class="fv-margin-top fv-margin-bottom">
    <fvSlider v-model="slider">
      <template
        slot="tab"
        slot-scope="scope"
      >
        {{ tabs[scope.index].title }}
      </template>
      <fvSlide
        v-for="tab in tabs"
        :key="tab.slot"
        class="fv-padding-top fv-padding-bottom"
      >
        <fvTable
          class="fv-border fv-shadow fv-radius"
          :fields="fields(tab.slot)"
          :rows="content[tab.slot]"
          :breaked.sync="tableBreaked"
        >
          <template
            slot="field-Name"
            slot-scope="scope"
          >
            <b class="fv-text-secondary">{{ nameFormatter(scope.row.name).title }}</b> <b
              v-if="nameFormatter(scope.row.name).required"
              class="fv-text-danger fv-margin"
            >*</b>
          </template>
          <template
            slot="field-Type"
            slot-scope="scope"
          >
            <div style="min-width: 120px">
              <span
                v-for="(type, index) in typeFormatter(scope.row.type)"
                v-if="scope.row.type"
                :key="scope.index + type + tab.slot"
                class="fv-text-primary"
              >
                {{ type }}
                <small
                  v-if="index < typeFormatter(scope.row.type).length - 1"
                  class="fv-text-gray"
                > or </small>
              </span>
              <span v-else>---</span>
            </div>
          </template>
          <template
            slot="field-Default"
            slot-scope="scope"
          >
            <span class="fv-text-gray">{{ scope.row.default || '---' }}</span>
          </template>
          <template
            slot="field-Params"
            slot-scope="scope"
          >
            <div style="min-width: 120px">
              <span
                v-for="(param, index) in typeFormatter(scope.row.params)"
                v-if="scope.row.params"
                :key="scope.index + param + tab.slot"
                class="fv-text-primary"
              >
                {{ param }}
                <small
                  v-if="index < typeFormatter(scope.row.params).length - 1"
                  class="fv-text-gray"
                > and </small>
              </span>
              <span v-else>---</span>
            </div>
          </template>
          <template
            slot="field-Description"
            slot-scope="scope"
          >
            <div v-html="descriptionFormatter(scope.row.description)" />
          </template>
        </fvTable>
      </fvSlide>
    </fvSlider>
  </div>
</template>
// (can apply to all elements, not this one or either this childs)
<script>
export default {
  filters: {
    name(name) {
      return `${name}salam`;
    },
  },
  props: {
    content: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      slider: undefined,
      tableBreaked: false,
    };
  },
  computed: {
    tabs() {
      const tabs = [];
      if (this.content.prop) {
        tabs.push({
          title: 'Props',
          slot: 'prop',
        });
      }
      if (this.content.event) {
        tabs.push({
          title: 'Events',
          slot: 'event',
        });
      }
      if (this.content.method) {
        tabs.push({
          title: 'Methods',
          slot: 'method',
        });
      }
      if (this.content.slot) {
        tabs.push({
          title: 'Slots',
          slot: 'slot',
        });
      }
      if (this.content.scopedSlot) {
        tabs.push({
          title: 'Scoped Slots',
          slot: 'scopedSlot',
        });
      }
      if (this.content.class) {
        tabs.push({
          title: 'CSS Classes',
          slot: 'class',
        });
      }
      return tabs;
    },
  },
  methods: {
    fields(tabSlot) {
      switch (tabSlot) {
        case 'prop':
          return ['Name', 'Type', 'Default', 'Description'];
        case 'event':
          return ['Name', 'Params', 'Description'];
        case 'method':
          return ['Name', 'Params', 'Description'];
        case 'slot':
          return ['Name', 'Description'];
        case 'scopedSlot':
          return ['Name', 'Params', 'Description'];
        case 'class':
          return ['Name', 'Description'];
      }
    },
    descriptionFormatter(description) {
      if (!description) {
        return '---';
      }

      if (description.indexOf('public_class') > -1) {
        return `${description.replace('public_class', '')} <i>(can apply to all elements, not only this component or either this childs)</i>`;
      }

      return description;
    },
    nameFormatter(name) {
      let required = false;
      if (name.indexOf('*') > -1) {
        required = true;
      }
      return {
        title: name.replace('*', '').trim(),
        required,
      };
    },
    typeFormatter(type) {
      if (!type) {
        return ['---'];
      }
      const isArr = type.indexOf('[') > -1;
      if (isArr) {
        const tp = type.replace('[', '').replace(']', '').split('(,)').join('%')
          .split(',')
          .join('#')
          .split('%')
          .join(',');
        return tp.split('#').map((tp) => tp.trim());
      }
      return [type];
    },
  },
};
</script>

<style lang="scss">
body .doc-api-table {
  & .fmin {
    min-width: 80px;
  }
}
</style>
