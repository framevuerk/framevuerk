<template>
  <component
    :is="tag"
  >
    <!-- eslint-disable vue/no-v-html -->
    <div
      v-if="tag === 'td'"
      class="title"
      @click="simulateClick"
      v-html="titleContent()"
    />
    <!-- eslint-enable vue/no-v-html -->
    <div
      :class="tag === 'td' ? 'value' : 'title'"
      @click="onClick"
    >
      <slot />
    </div>
  </component>
</template>

<doc>
@doc @description Use for both field title and field value inside Table component. Check Table component to view example.
@prop name* @type String @description Field unique id.
@event click @params event @description Triggers when user clicks on field.
@slot default
</doc>

<script>
export default {
  inject: {
    $table: {},
    $row: {
      default: null,
    },
  },
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  computed: {
    tag() {
      return this.$row ? 'td' : 'th';
    },
  },
  created() {
    if (!this.$row) {
      this.$table.fields.push(this);
    }
  },
  methods: {
    titleContent() {
      try {
        const thComponent = this.$table.fields.find((field) => field.name === this.name);
        return thComponent.$el.innerHTML;
      } catch (_e) {
        return '';
      }
    },
    simulateClick(e) {
      try {
        const thComponent = this.$table.fields.find((field) => field.name === this.name);
        thComponent.onClick(e);
      // eslint-disable-next-line no-empty
      } catch (_e) {}
    },
    onClick(e) {
      this.$emit('click', e);
    },
  },
};
</script>
