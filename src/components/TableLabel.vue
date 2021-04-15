<template>
  <th
    class="label"
    @click="emitClick"
  >
    <slot />
  </th>
</template>

<script>
import { inject } from '../utility/vue';

export default {
  emits: ['click'],
  ...inject('$table'),
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
  },
  created() {
    this.$table.labels.push(this);
  },
  methods: {
    emitClick(e) {
      this.$emit('click', e);
    },
  },
};
</script>
