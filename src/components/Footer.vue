<template>
  <footer :class="$style.footer">
    <slot />
  </footer>
</template>

<script>
import { inject, props } from '../utility/vue';
import color from '../mixins/color';

export default {
  mixins: [color('footer')],
  ...inject('$theme'),
  ...props({
    type: props.oneOf(['normal', 'pinned'], 'normal'),
  }),
  style({ className }) {
    const $color = this.$theme.colors[this.$color];
    const $sizes = this.$theme.sizes;
    const positionMap = {
      normal: 'static',
      pinned: 'sticky',
    };
    return [
      className('footer', {
        backgroundColor: $color.bg,
        color: $color.fg,
        borderColor: $color.shade(-15),
        // boxShadow: $sizes.shadow.factor('md', 'top'),
        borderTopWidth: $sizes.border.px,
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
