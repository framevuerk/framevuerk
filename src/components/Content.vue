<template>
<div :class="$style.content">
  <slot />
</div>
</template>

<script>
export default {
  style({ className }) {
    return [
      className('content', {
        flexGrow: 1,
      }),
    ];
  },
};
</script>
