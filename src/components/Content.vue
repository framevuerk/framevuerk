<template>
  <div :class="$style.content">
    <slot />
  </div>
</template>

<docs src="./Content.html" />

<script>
export default {
  style({ className }) {
    return [
      className('content', {
        flexGrow: 1,
        maxWidth: '100%',
        minWidth: 0,
      }),
    ];
  },
};
</script>
