<template>
  <header
    :class="$style.header"
    data-dev="comment-for-loader"
  >
    <slot />
  </header>
</template>

<doc>

@prop type @type oneOf('normal', 'pinned') @default 'normal' @comment used to felan
@prop size @type Number @default 23 @comment used to bahman
@prop state @type oneOf(true, false, null) @default null @comment felan bisar

@event expand @param newFelan @param newBahman @comment hoyyy

@slot default
@slot address @scope field

</doc>

<example>
@config state false
@config example false

<fvLayout>
  <fvHeader slot="header"> <!-- Content --> </fvHeader>
  <!-- ... -->
  <!-- ... -->
  <!-- ... -->
</fvLayout>

</example>

<script>
import { offsetTo } from '../utility/utils';

export default {
  props: {
    /** @values 'normal', 'smart', 'pinned' */
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
  mounted() {
    if (this.type === 'smart') {
      this.offsetToParent = offsetTo(this.$el, null).top;
      this.$layout.on('scroll', this.handleSmart);
    }
  },
  beforeDestroy() {
    this.$layout.off('scroll', this.handleSmart);
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
