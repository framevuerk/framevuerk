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

export default {
  name: 'Sidebar',
  emits: ['update:visible'],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      validator: (position) => ['start', 'end'].includes(position),
      required: true,
    },
    type: {
      type: String,
      validator: (type) => ['smart', 'pinned', 'unpinned'].includes(type),
      default: 'smart',
    },
  },
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
    const position = this.$theme.direction[this.position];
    return [
      className('sidebar', {
        backgroundColor: this.$theme.colors.sidebar.normal,
        color: this.$theme.colors.sidebar.text,
        borderColor: this.$theme.colors.sidebar.shade(-15),
        minHeight: '100%',
        height: '100%',
        maxHeight: '100%',
        top: 0,
        '&.pinned': {
          [position]: 0,
          overflowX: 'hidden !important',
          transition: `transform ${this.$theme.speed.normal} ease`,
          position: 'relative',
          '&.show': {
            transform: 'translateX(0) !important',
          },
          '&.hide': {
            position: 'fixed',
            transform: `translateX(${this.$theme.direction[`${position}Factor`] * -100}%)`,
          },
        },
        '&.unpinned': {
          overflow: 'auto',
          position: 'fixed',
          transition: `transform ${this.$theme.speed.normal} ease-in-out`,
          zIndex: 2,
          [`border-${position}-width`]: this.$theme.sizes.base.factor('md', 'border'),
          [`border-${position}-style`]: 'solid',
          '&.show': {
            transform: 'translateX(0) !important',
          },
          '&.hide': {
            transform: `translateX(${this.$theme.direction[`${position}Factor`] * -100}%)`,
          },
        },
      }),
    ];
  },
  inject: ['$layout', '$theme'],
};
</script>
