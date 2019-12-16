<template>
<header :class="$style.header">
  <slot />
</header>
</template>

<script>
import { offsetTo } from '@/utility/utils'
import parent from '@/utility/parent';

export default {
  props: {
    autoHide: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'background',
    }
  },
  data() {
    return {
      offsetToParent: 0,
    }
  },
  methods: {
    handleAutoHide(scrollTop, direction) {
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
    if (this.autoHide) {
      this.offsetToParent = offsetTo(this.$el, null).top;
      this.$layout.onScroll(this.handleAutoHide)
    }
  },
  beforeDestroy() {
    this.$layout.offScroll(this.handleAutoHide)
  },
  style({ className }) {
    return [
      className('header', {
        background: this.$theme.colors[this.color].normal,
        width: '100%',
        position: this.autoHide ? 'sticky' : 'static',
        top: '0',
        borderBottom: `solid 1px ${this.$theme.colors[this.color].shade(-30)}`,
        padding: this.$theme.sizes.base.multiplyBy(2),
        boxShadow: `0 ${this.$theme.sizes.shadow.normal} ${this.$theme.sizes.shadow.multiplyBy(0.8)} ${this.$theme.colors.background.shade(-50, 0.1)}`,
        color: this.$theme.colors[this.color].text,
        transition: `transform 300ms ease`,
        willChange: 'transform',
        '&.pre-show': {
          transform: 'translateY(-100%)',
        },
        '&.show': {
          transform: 'translateY(0)',
        }
      })
    ];
  },
  inject: ['$layout', '$theme'],
}
</script>