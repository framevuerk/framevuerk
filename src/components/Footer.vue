<template>
  <footer :class="$style.footer">
    <slot />
  </footer>
</template>

<doc>
@prop type @type oneOf('normal', 'pinned') @default 'normal' @description Type of footer behavior.

@slot default
</doc>

<example>
@config state false
@config example false

<fvLayout>
  <!-- ... -->
  <!-- ... -->
  <!-- ... -->
  <fvFooter #footer> <!-- Content --> </fvFooter>
</fvLayout>

</example>

<script>
export default {
  inject: ['$layout', '$theme'],
  props: {
    type: {
      type: String,
      default: 'normal',
      validator: (v) => ['normal', 'pinned'].includes(v),
    },
  },
  style({ className }) {
    const positionMap = {
      normal: 'static',
      pinned: 'sticky',
    };
    return [
      className('footer', {
        backgroundColor: this.$theme.colors.footer.normal,
        color: this.$theme.colors.footer.text,
        borderColor: this.$theme.colors.footer.shade(-15),
        boxShadow: this.$theme.sizes.shadow.factor('md', 'shadow', { dir: 'top' }),
        borderTopWidth: this.$theme.sizes.base.factor('md', 'border'),
        borderTopStyle: 'solid',
        width: '100%',
        position: positionMap[this.type],
        bottom: '0',
        zIndex: 1,
      }),
    ];
  },
};
</script>
