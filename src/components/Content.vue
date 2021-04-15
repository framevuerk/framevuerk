<template>
  <div :class="$style.content">
    <slot />
  </div>
</template>

<doc>
@slot default
</doc>

<example>
@config state false
@config example false

<fvLayout>
  <!-- ... -->
  <!-- ... -->
  <fvContent #content> <!-- Content --> </fvContent>
  <!-- ... -->
</fvLayout>

</example>

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
