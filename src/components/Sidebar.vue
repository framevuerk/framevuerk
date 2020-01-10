<template>
<aside :class="[$style.sidebar, className, visible ? 'show' : 'hide']">
  <slot />
</aside>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      validator: (v) => ['pinned', 'unattached', 'smart'].includes(v),
      default: 'smart',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      validator: (v) => ['start', 'end', 'left', 'right'].includes(v),
      default: 'start',
    },
  },
  data() {
    return {
      className: this.type,
      cancelDetector: null,
    };
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
  },
  created() {
    if (this.type === 'unattached') {
      this.$emit('update:visible', false);
    }
  },
  mounted() {
    if (this.type === 'smart') {
      this.handleSmart();
    }
  },
  watch: {
    visible(newValue) {
      if (this.visible && this.className === 'unattached') {
        this.cancelDetector = this.$layout.cancelDetector(this.$el, this.toggle);
      } else {
        this.cancelDetector && this.cancelDetector.release();
      }
    },
  },
  beforeDestroy() {
    this.cancelDetector && this.cancelDetector.release();
  },
  style({ className, mediaQuery }) {
    const position = this.$theme.direction[this.$layout.getSidebarPosition(this)];
    const unattachedPostion = this.$layout.global ? 'fixed' : 'absolute';
    return [
      className('sidebar', {
        backgroundColor: this.$theme.colors.sidebar.normal,
        color: this.$theme.colors.sidebar.text,
        borderColor: this.$theme.colors.sidebar.shade(-15),
        minHeight: '100%',
        [position]: 0,
        overflowX: 'hidden !important',
        '&.pinned': {
          transition: `transform ${this.$theme.speed.normal} ease`,
          position: 'relative',
          '&.show': {
            transform: 'translateX(0) !important',
          },
          '&.hide': {
            position: unattachedPostion,
            transform: `translateX(${this.$theme.direction[`${position}Factor`] * -100}%)`,
          },
        },
        '&.unattached': {
          top: '0',
          height: '100%',
          maxHeight: '100%',
          overflow: 'auto',
          position: unattachedPostion,
          transition: `transform ${this.$theme.speed.normal} ease-in-out`,
          zIndex: 2,
          '&.show': {
            transform: 'translateX(0) !important',
          },        [`border-${position}-width`]: this.$theme.sizes.base.factor('md', 'border'),
        [`border-${position}-style`]: 'solid',
          '&.hide': {
            transform: `translateX(${this.$theme.direction[`${position}Factor`] * -100}%)`,
          },
        },
      }),
      mediaQuery({ maxWidth: '960px' }, [
        className('sidebar', {
          '&.smart': {
            position: 'absolute',
            opacity: 0,
          },
        }),
      ]),
    ];
  },
  inject: ['$layout', '$theme'],
};
</script>
