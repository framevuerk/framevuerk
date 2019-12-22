<template>
<header :class="$style.header">
  <slot />
</header>
</template>

<script>
import { offsetTo } from '@/utility/utils';

export default {
  props: {
    type: {
      type: String,
      default: 'smart',
      validator: (v) => ['normal', 'smart', 'pinned'].includes(v),
    },
  },
  data() {
    return {
      offsetToParent: 0,
    };
  },
  methods: {
    handleSmart(scrollTop, direction) {
      if (scrollTop > this.offsetToParent) {
        this.$el.classList.add('pre-show');
        if (direction === 'down') {
          this.$el.classList.remove('show');
        } else {
          this.$el.classList.add('show');
        }
      } else {
        this.$el.classList.remove('pre-show');
      }
    },
  },
  mounted() {
    if (this.type === 'smart') {
      this.offsetToParent = offsetTo(this.$el, null).top;
      this.$layout.on('scroll', this.handleSmart);
    }
  },
  beforeDestroy() {
    this.$layout.off('scroll', this.handleSmart);
  },
  style({ className }) {
    const positionMap = {
      normal: 'static',
      smart: 'sticky',
      pinned: 'sticky',
    };
    return [
      className('header', {
        boxShadow: `0 ${this.$theme.sizes.shadow.normal} ${this.$theme.sizes.shadow.normal} ${this.$theme.colors.background.shade(-50, 0.2)}`,
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        width: '100%',
        position: positionMap[this.type],
        top: '0',
        padding: this.$theme.sizes.base.normal,
        transition: 'transform 250ms ease-out',
        willChange: 'transform',
        zIndex: 1,
        '&.pre-show': {
          transform: 'translateY(-100%)',
        },
        '&.show': {
          transform: 'translateY(0)',
        },
      }),
    ];
  },
  inject: ['$layout', '$theme'],
};
</script>
