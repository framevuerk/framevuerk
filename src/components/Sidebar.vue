<template>
  <aside :class="[$style.sidebar, visible ? 'show' : 'hide']">
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
  <fvSidebar slot="start-sidebar"> <!-- Content --> </fvSidebar>
  <!-- ... -->
  <!-- ... -->
</fvLayout>

</example>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      lastCapturedViewportWidth: 0,
      cancelDetector: null,
    };
  },
  watch: {
    visible(newValue) {
      if (this.cancelDetector) {
        this.cancelDetector.release();
      }
      if (newValue && window.innerWidth < 992) {
        this.cancelDetector = this.$layout.cancelDetector(this.$el, this.toggle);
      }
    },
  },
  mounted() {
    if (window.innerWidth < 992) {
      this.$emit('update:visible', false);
    } else {
      this.$emit('update:visible', true);
    }
    this.$layout.on('resize', this.handleResize);
  },
  beforeDestroy() {
    if (this.cancelDetector) {
      this.cancelDetector.release();
    }
    this.$layout.off('resize', this.handleResize);
  },
  methods: {
    toggle() {
      this.$emit('update:visible', !this.visible);
    },
    handleSmart() {
      this.$el.style.transitionDuration = '0s';
      this.$emit('update:visible', window.innerWidth >= 992);
      this.className = window.innerWidth >= 992 ? 'pinned' : 'unattached';
      setTimeout(() => {
        this.$el.style.transitionDuration = null;
      });
    },
    handleResize() {
      if (window.innerWidth !== this.lastCapturedViewportWidth) {
        this.handleSmart();
        this.lastCapturedViewportWidth = window.innerWidth;
      }
    },
  },
  style({ className, mediaQuery }) {
    const position = this.$theme.direction[this.$layout.getSidebarPosition(this)];
    return [
      className('sidebar', {
        backgroundColor: this.$theme.colors.sidebar.normal,
        color: this.$theme.colors.sidebar.text,
        borderColor: this.$theme.colors.sidebar.shade(-15),
        minHeight: '100%',
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
      }),
      mediaQuery({ maxWidth: '991px' }, [
        className('sidebar', {
          top: '0',
          height: '100%',
          maxHeight: '100%',
          overflow: 'auto',
          position: 'fixed',
          transition: `transform ${this.$theme.speed.normal} ease-in-out`,
          zIndex: 2,
          '&.show': {
            transform: 'translateX(0) !important',
          },
          [`border-${position}-width`]: this.$theme.sizes.base.factor('md', 'border'),
          [`border-${position}-style`]: 'solid',
          '&.hide': {
            transform: `translateX(${this.$theme.direction[`${position}Factor`] * -100}%)`,
          },
        }),
      ]),
    ];
  },
  inject: ['$layout', '$theme'],
};
</script>
