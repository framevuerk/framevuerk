<template>
  <aside :class="[$style.sidebar, trueType, visible ? 'show' : 'hide']">
    <slot />
  </aside>
</template>

<doc>
@prop visible @type Boolean @default false @description Sidebar visibility. To use all of fvSidebar functionality, use .sync modifier.

@slot default

@event update:visible @description @params newVisible @description Triggers when sidemenu open/close.
</doc>

<example>
@config state false
@config example false

<fvLayout>
  <!-- ... -->
  <fvSidebar #start-sidebar> <!-- Content --> </fvSidebar>
  <!-- ... -->
  <!-- ... -->
</fvLayout>

</example>

<script>
import cancelDetector from '../utility/cancelDetector';
import { inject, props } from '../utility/vue';
import color from '../mixins/color';

export default {
  mixins: [color('sidebar')],
  emits: ['update:visible'],
  ...inject('$theme', '$layout'),
  ...props({
    visible: props.bool(false),
    position: props.oneOf(['start', 'end']),
    type: props.oneOf(['smart', 'pinned', 'unpinned'], 'smart'),
  }),
  data() {
    return {
      cancelDetector: null,
      resizeListener: null,
      trueType: null,
    };
  },
  watch: {
    visible(visible) {
      if (this.cancelDetector) {
        this.cancelDetector.release();
      }
      if (visible && this.trueType === 'unpinned') {
        this.cancelDetector = cancelDetector(this.$el, this.toggle);
      }
    },
    type: {
      handler(type) {
        if (type === 'smart') {
          this.$nextTick(() => {
            this.resizeListener = this.$layout.listen('resize', this.handleLayoutResize, true);
          });
        } else {
          this.trueType = this.type;
          if (this.resizeListener) {
            this.resizeListener.release();
          }
        }
      },
      immediate: true,
    },
  },
  beforeUnmount() {
    if (this.cancelDetector) {
      this.cancelDetector.release();
    }
    if (this.resizeListener) {
      this.resizeListener.release();
    }
  },
  methods: {
    toggle() {
      this.$emit('update:visible', !this.visible);
    },
    handleLayoutResize() {
      const isLargeLayout = window.innerWidth >= 992;
      this.$el.style.transitionDuration = '0s';
      this.$emit('update:visible', isLargeLayout);
      this.trueType = isLargeLayout ? 'pinned' : 'unpinned';
      setTimeout(() => {
        this.$el.style.transitionDuration = null;
      });
    },
  },
  style({ className }) {
    const position = this.$theme.direction.static(this.position);
    const opositePosition = position === 'left' ? 'right' : 'left';
    const $color = this.$theme.colors[this.$color];
    const $speed = this.$theme.speed;
    const $sizes = this.$theme.sizes;
    const $direction = this.$theme.direction;
    return [
      className('sidebar', {
        backgroundColor: $color.bg,
        color: $color.fg,
        borderColor: $color.shade(-15),
        [`border-${opositePosition}-width`]: $sizes.border.px,
        borderStyle: 'solid',
        boxShadow: $sizes.shadow.factor('md', opositePosition),
        height: 'auto',
        top: 0,
        '&.pinned': {
          [position]: 0,
          overflowX: 'hidden !important',
          transition: `transform ${$speed.ms} ease`,
          position: 'relative',
          '&.hide': {
            position: 'fixed',
            height: '100%',
          },
        },
        '&.unpinned': {
          overflow: 'auto',
          position: 'fixed',
          transition: `transform ${$speed.ms} ease-in-out`,
          zIndex: 2,
          [`border-${position}-width`]: $sizes.border.px,
          [`border-${position}-style`]: 'solid',
          height: '100%',
        },
        '&.show': {
          transform: 'translateX(0) !important',
        },
        '&.hide': {
          transform: `translateX(${$direction[`${position}Factor`] * -100}%)`,
        },
      }),
    ];
  },
};
</script>
