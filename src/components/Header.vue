<template>
  <header
    :class="$style.header"
  >
    <slot />
  </header>
</template>

<doc>
@prop type @type oneOf('smart', 'normal', 'pinned') @default 'smart' @description Type of header behavior.

@slot default
</doc>

<example>
@config state false
@config example false

<fvLayout>
  <fvHeader #header> <!-- Content --> </fvHeader>
  <!-- ... -->
  <!-- ... -->
  <!-- ... -->
</fvLayout>

</example>

<script>
import { offsetTo } from '../utility/utils';

export default {
  name: 'Header',
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
      scrollListener: null,
    };
  },
  watch: {
    type: {
      handler(type) {
        this.$nextTick(() => {
          this.$el.classList.remove('pre-show', 'show');
          if (type === 'smart') {
            this.scrollListener = this.$layout.listen('scroll', this.handleLayoutScroll);
          } else if (this.scrollListener) {
            this.scrollListener.release();
          }
        });
      },
      immediate: true,
    },
  },
  mounted() {
    this.offsetToParent = offsetTo(this.$el, null).top;
  },
  beforeUnmount() {
    if (this.scrollListener) {
      this.scrollListener.release();
    }
  },
  methods: {
    handleLayoutScroll({ scrollTop, direction }) {
      this.$el.classList[scrollTop > this.offsetToParent ? 'add' : 'remove']('pre-show');
      this.$el.classList[direction === 'down' ? 'remove' : 'add']('show');
    },
  },
  style({ className }) {
    const positionMap = {
      normal: 'static',
      smart: 'sticky',
      pinned: 'sticky',
    };
    return [
      className('header', {
        backgroundColor: this.$theme.colors.header.normal,
        color: this.$theme.colors.header.text,
        borderColor: this.$theme.colors.header.shade(-15),
        boxShadow: this.$theme.sizes.shadow.factor('md', 'shadow', { dir: 'bottom' }),
        borderBottomWidth: this.$theme.sizes.base.factor('md', 'border'),
        borderBottomStyle: 'solid',
        width: '100%',
        position: positionMap[this.type],
        top: '0',
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
