<template>
<aside :class="[$style.sidebar, className, visible ? 'show' : 'hide']">
  <div class="content" ref="content">
    <slot />
  </div>
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
    }
  },
  data() {
    return {
      className: 'smart',
    }
  },
  methods: {
    toggle () {
      this.$emit('update:visible', !this.visible);
    },
    handleSize() {
      const width = `${this.$el.offsetWidth || 250}px`;
      this.$el.style.maxWidth = width;
      this.$refs.content.style.width = width;
    },
    handleSmart(size) {
      this.$el.style.transitionDuration = '0s';
      this.$layout.unlock();
      this.$emit('update:visible', size.width > 960);
      this.className = size.width > 960 ? 'pinned' : 'unattached';
      if (size.width >= 960 && this.visible) {
        this.$nextTick(this.handleSize);
      }
      setTimeout(() => {
        this.$el.style.transitionDuration = null;
      });
    },
  },
  created() {
    if (this.sidebar === 'unattached') {
      this.$emit('update:visible', false);
    }
  },
  mounted() {
    this.handleSize();
    if (this.type === 'smart') {
      this.$layout.on('resize', this.handleSmart, true);
    }
  },
  watch: {
    visible(newValue) {
      if (this.visible && this.className === 'unattached') {
        this.$layout.lock();
        this.$layout.neglectTo(this.$el, this.toggle);
      } else {
        this.$layout.unlock();
      }
    }
  },
  beforeDestroy() {
    this.$layout.off('resize', this.handleSmart)
  },
  style({ className, mediaQuery }) {
    const unattachedPostion = this.$layout.global ? 'fixed' : 'absolute';
    return [
      className('sidebar', {
        background: this.$theme.colors[this.color].normal,
        color: this.$theme.colors[this.color].text,
        boxShadow: `${this.$theme.sizes.shadow.normal} 0 ${this.$theme.sizes.shadow.normal} ${this.$theme.colors.background.shade(-50, 0.2)}`,
        [`border-${this.$theme.direction.end}`]: `solid 1px ${this.$theme.colors[this.color].shade(-15)}`,
        minHeight: '100%',
        
        overflowX: 'hidden !important',
        '& > .content': {
          transition: `transform ${this.$theme.speed.normal} ease-out`,
        },
        '&.pinned': {
          transition: `max-width ${this.$theme.speed.normal} ease-out`,
          '&.show': {
            width: 'auto',
            maxWidth: '250px',
          },
          '&.hide': {
            maxWidth: '0px !important',
            overflow: 'hidden',
            '& > .content': {
              transform: `translateX(${this.$theme.direction.leftFactor * -100}%)`
            },
          }
        },
        '&.unattached': {
          top: '0',
          height: '100%',
          maxHeight: '100%',
          overflow: 'auto',
          position: unattachedPostion,
          transition: `transform ${this.$theme.speed.normal} ease-out`,
          zIndex: '2',
          '&.show': {
            transform: `translateX(0) !important`,
          },
          '&.hide': {
            transform: `translateX(${this.$theme.direction.leftFactor * -100}%)`
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