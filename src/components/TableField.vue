<template>
  <td>
    <div
      v-if="label"
      class="label"
      @click="emitLabelClick"
    >
      <render-slot
        :slots="labelSlot"
      />
    </div>
    <div
      class="value"
      @click="emitClick"
    >
      <slot />
    </div>
  </td>
</template>

<script>
import RenderSlot from './_RenderSlot.vue';

export default {
  components: {
    RenderSlot,
  },
  emits: ['click'],
  inject: ['$table', '$theme'],
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
  },
  computed: {
    label() {
      return this.$table.labels.find((item) => item.value === this.value);
    },
    labelSlot() {
      try {
        return this.label.$slots.default();
      } catch (_e) {
        return null;
      }
    },
  },
  methods: {
    emitClick(e) {
      this.$emit('click', e);
    },
    emitLabelClick(e) {
      if (this.label) {
        this.label.emitClick(e);
      }
    },
  },
};
</script>
