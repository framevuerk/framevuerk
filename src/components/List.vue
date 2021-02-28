<template>
  <component
    :is="tag"
    :class="$style.list"
  >
    <slot />
  </component>
</template>

<doc>
@prop tag @type String @default 'ul' @description Default root element of component.

@slot default
</doc>

<example>
@config title 'Default'
@config state false
@config example true

<fvList>
  <fvListItem> Item #1 </fvListItem>
  <fvListItem> Item #2 </fvListItem>
  <fvListItem> Item #3 </fvListItem>
</fvList>
</example>

<script>
import injector from '../utility/injector';

export default {
  ...injector('$theme', ['$list', null]),
  props: {
    tag: {
      type: String,
      default: 'ul',
    },
    focusable: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    isFocusable() {
      return this.focusable || (this.$list && this.$list.isFocusable);
    },
    indent() {
      return this.$list ? this.$list.indent + 1 : 1;
    },
  },
  provide() {
    return {
      $list: this,
    };
  },
  style({ className }) {
    return [
      className('list', {
        userSelect: 'none',
        '& > *:first-child': {
          borderTopWidth: 0,
        },
      }),
    ];
  },
};
</script>
