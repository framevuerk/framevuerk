<template>
  <fvListItem
    :selected="isSelected"
    :disabled="disabled"
    @click="onClick"
  >
    <slot />
  </fvListItem>
</template>

<doc>
@doc @description Use for Select component options. Check Select component to view example.
@prop value* @type Any @description Option value.
@prop disabled @type Boolean @default false @description Is option disabled?
@slot default
</doc>

<script>
import color from '../mixins/color';
import size from '../mixins/size';
import formElement from '../mixins/formElement';

const toStatic = JSON.stringify;

export default {
  inject: ['$theme', '$select'],
  mixins: [
    color,
    size,
    formElement,
  ],
  props: {
    // eslint-disable-next-line vue/require-prop-types
    value: {
      default: undefined,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isSelected() {
      return this.$select.forceArrayValue.findIndex((x) => toStatic(x) === toStatic(this.value)) > -1;
    },
  },
  created() {
    this.$select.options.push(this);
  },
  methods: {
    onClick() {
      this.$select.handleClickOption(this.value);
    },
  },
};
</script>
