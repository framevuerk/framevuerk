<template>
<footer :class="$style.footer">
  <slot />
  <slot name="ali" value="xxx" />
</footer>
</template>

<example>
@config state false
@config example false

<fvLayout>
  <!-- ... -->
  <!-- ... -->
  <!-- ... -->
  <fvFooter slot="footer"> <!-- Content --> </fvFooter>
</fvLayout>

</example>

<script>
import { offsetTo } from '../utility/utils';

export default {
  props: {
    /** @values 'normal', 'pinned' */
    type: {
      type: String,
      default: 'normal',
      validator: (v) => ['normal', 'pinned'].includes(v),
    },
  },
  data() {
    return {
      offsetToParent: 0,
    };
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
  inject: ['$layout', '$theme'],
};
</script>
