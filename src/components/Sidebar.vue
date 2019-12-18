<template>
<aside :class="[$style.sidebar, className, visible ? 'show' : 'hide']">
  <slot />
</aside>
</template>

<script>
import parent from '../utility/parent.js'

export default {
  props: {
    color: {
      type: String,
      default: 'sidebar',
    },
    type: {
      type: String,
      validator: (v) => ['pinned', 'unattached', 'smart'].includes(v),
      default: 'smart',
    },
    visible: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      validator: (v) => ['start', 'end'].includes(v),
      default: 'start',
    },
  },
  data() {
    return {
      className: 'smart',
      cancelDetector: null,
      focusStoler: null,
    }
  },
  methods: {
    toggle () {
      this.$emit('update:visible', !this.visible);
    },
    handleSmart(size) {
      this.$el.style.transitionDuration = '0s';
      this.$layout.unlock();
      this.$emit('update:visible', size.width > 960);
      this.className = size.width > 960 ? 'pinned' : 'unattached';
      setTimeout(() => {
        this.$el.style.transitionDuration = null;
      });
    },
  },
  created() {
    if (this.type !== 'smart') {
      this.className = this.type;
    }
    if (this.type === 'unattached') {
      this.$emit('update:visible', false);
    }
  },
  mounted() {
    if (this.type === 'smart') {
      this.$layout.on('resize', this.handleSmart, true);
    }
  },
  watch: {
    visible(newValue) {
      if (this.visible && this.className === 'unattached') {
        this.$layout.lock();
        this.cancelDetector = this.$layout.cancelDetector(this.toggle);
        this.focusStoler = this.$layout.focusStoler(this.$el);
        this.outerClickDetector = this.$layout.outerClickDetector(this.$el, this.toggle);
      } else {
        this.$layout.unlock();
        this.cancelDetector && this.cancelDetector.release();
        this.focusStoler && this.focusStoler.release();
        this.outerClickDetector && this.outerClickDetector.release();
      }
    }
  },
  beforeDestroy() {
    this.$layout.off('resize', this.handleSmart);
    this.cancelDetector && this.cancelDetector.release();
    this.focusStoler && this.focusStoler.release();
    this.outerClickDetector && this.outerClickDetector.release();
  },
  style({ className, mediaQuery }) {
    const position = this.$theme.direction[this.position];
    const unattachedPostion = this.$layout.global ? 'fixed' : 'absolute';
    return [
      className('sidebar', {
        background: this.$theme.colors[this.color].normal,
        color: this.$theme.colors[this.color].text,
        boxShadow: `${this.$theme.sizes.shadow.normal} 0 ${this.$theme.sizes.shadow.normal} ${this.$theme.colors.background.shade(-50, 0.2)}`,
        [`border-${position}`]: `solid 1px ${this.$theme.colors[this.color].shade(-15)}`,
        minHeight: '100%',
        [position]: 0,
        overflowX: 'hidden !important',
        '&.pinned': {
          transition: `transform ${this.$theme.speed.normal} ease-out`,
          position: 'relative',
          '&.show': {
            transform: `translateX(0) !important`,
          },
          '&.hide': {
            position: unattachedPostion,
            transform: `translateX(${this.$theme.direction[`${position}Factor`] * -100}%)`,
          }
        },
        '&.unattached': {
          top: '0',
          height: '100%',
          maxHeight: '100%',
          overflow: 'auto',
          position: unattachedPostion,
          transition: `transform ${this.$theme.speed.normal} ease-out`,
          zIndex: 2,
          '&.show': {
            transform: `translateX(0) !important`,
          },
          '&.hide': {
            transform: `translateX(${this.$theme.direction[`${position}Factor`] * -100}%)`
          }
        }
      }),
      mediaQuery({maxWidth: '960px'}, [
        className('sidebar', {
          '&.smart': {
            position: 'absolute',
            opacity: 0,
          }
        })
      ])
    ];
  },
  inject: ['$layout', '$theme'],
}
</script>