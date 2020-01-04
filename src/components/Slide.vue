<template>
<div :class="$style.slide">
  <slot />
</div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  style({className}) {
    return [
      className('slide', {
        userSelect: 'none',
        overflowX: 'hidden',
        flexGrow: 1,
        flexBasis: 0,
        flexShrink: 1,
      })
    ];
  },
}
</script>