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
import color from '../mixins/color';
import { inject, props } from '../utility/vue';

export default {
  mixins: [color('header')],
  ...inject('$theme', '$layout'),
  ...props({
    type: props.oneOf(['normal', 'smart', 'pinned'], 'smart'),
  }),
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
      const { classList } = this.$el;
      classList[scrollTop > this.offsetToParent ? 'add' : 'remove']('pre-show');
      classList[direction === 'down' ? 'remove' : 'add']('show');
    },
  },
  style({ className }) {
    const $color = this.$theme.colors[this.$color];
    const $sizes = this.$theme.sizes;
    const positionMap = {
      normal: 'static',
      smart: 'sticky',
      pinned: 'sticky',
    };
    return [
      className('header', {
        backgroundColor: $color.bg,
        color: $color.fg,
        borderColor: $color.shade(-15),
        boxShadow: $sizes.shadow.factor('lg', 'bottom'),
        borderBottomWidth: $sizes.border.px,
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
};
</script>
