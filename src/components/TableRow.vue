<template>
  <tr
    @click="onClick"
  >
    <slot name="td" />
  </tr>
</template>

<doc>
@doc @description Use for table rows inside Table component. Check Table component to view example.
@slot td @description Use fvTableField with this slot name inside component content. Each `td` slot counts as one field.
@event click @params event @description Triggers when user clicks on row.
</doc>

<script>
export default {
  provide() {
    return {
      $row: this,
    };
  },
  data() {
    return {
      fields: [], // will fill by children
    };
  },
  methods: {
    onClick(event) {
      this.$emit('click', event);
    },
  },
};
</script>
