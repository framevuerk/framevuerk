<template>
  <transition
    :name="$style.menuAnimation"
  >
    <div
      v-if="visible"
      ref="menu"
      :class="$style.menu"
      :style="position"
      css-color="background"
      css-border="md"
      css-shadow-bottom="md"
      css-radius="md"
    >
      <slot />
    </div>
  </transition>
</template>

<doc>

@slot default

@event open @description Triggers when dialog opens.
@event close @description Triggers when dialog closes.
@method open @params $event @description Call this method with js native 'event' object to open menu.
@method close @params $event @description Call this method close menu.
</doc>

<example>
@config title 'Default'
@config state true
@config example true

@data dialogOne = false

<div css-padding="xl" css-border="md" @contextmenu.prevent="$refs.menu.open($event)">
  <div css-padding="xl"></div>
  <div css-padding="xl"></div>
  Right-Click inside this Box
  <div css-padding="xl"></div>
  <div css-padding="xl"></div>
</div>
<fvMenu ref="menu">
  <h2 css-border-bottom="md" css-padding="md">Hi There</h2>
  <div css-border-bottom="md" css-padding="md">One Two Three Four</div>
</fvMenu>

</example>

<script>
import cancelDetector from '../utility/cancelDetector';

export default {
  inject: ['$theme'],
  data() {
    return {
      visible: false,
      position: {},
      cancelDetector: null,
      parentElement: null,
    };
  },
  watch: {
    visible(value) {
      this.handleVisibleChange(value);
    },
  },
  beforeDestroy() {
    if (this.cancelDetector) {
      this.cancelDetector.release();
    }
    this.$el.remove();
  },
  methods: {
    handleVisibleChange(value) {
      this[value ? 'handleOpen' : 'handleClose']();
    },
    handleOpen() {
      if (this.cancelDetector) {
        this.cancelDetector.release();
      }
      this.parentElement = this.$el.parentElement;
      document.body.appendChild(this.$el);
      this.$nextTick(() => {
        this.cancelDetector = cancelDetector(this.$refs.menu, this.close);
        this.$emit('open');
      });
    },
    handleClose() {
      if (this.cancelDetector) {
        this.cancelDetector.release();
      }
      if (this.parentElement) {
        this.parentElement.appendChild(this.$el);
      }
      this.$emit('close');
    },
    open(event) {
      this.visible = true;
      let position = {};
      const setPosition = (top, left) => ({ top, left });
      const viewport = {
        height: window.innerHeight,
        width: window.innerWidth,
      };

      if (event instanceof TouchEvent && event.touches.length) {
        const touch = event.touches[0];
        position = setPosition(touch.clientY, touch.clientX);
      } else if (event.pageY || event.pageX) {
        position = setPosition(event.clientY, event.clientX);
        event.preventDefault();
      } else {
        const rect = event.target.getBoundingClientRect();
        position = setPosition(rect.top, rect.left);
      }

      // a number between 0 and 1. lowest number is nearest to start direction of block
      const horizontalPosition = position.left / viewport.width;
      // it will be one of [0, 1, 2]. lowest number is nearest to top
      const verticalPosition = position.top / viewport.height;

      if (
        (this.$theme.direction.start === 'left' && horizontalPosition > 0.65)
        || (this.$theme.direction.start === 'right' && horizontalPosition > 0.45)
      ) {
        position.right = viewport.width - position.left;
        delete position.left;
      }
      if (verticalPosition > 0.7) {
        position.bottom = viewport.height - position.top;
        delete position.top;
      }

      this.position = {
        top: typeof position.top === 'undefined' ? 'auto' : `${position.top}px`,
        left: typeof position.left === 'undefined' ? 'auto' : `${position.left}px`,
        bottom: typeof position.bottom === 'undefined' ? 'auto' : `${position.bottom}px`,
        right: typeof position.right === 'undefined' ? 'auto' : `${position.right}px`,
      };
    },
    close() {
      this.visible = false;
    },
  },
  style({ className }) {
    return [
      className('menu', {
        position: 'fixed',
        width: '150px',
        height: 'auto',
        maxHeight: '75%',
        maxWidth: '75%',
        overflow: 'auto',
        zIndex: 4,
      }),
      className('menuAnimation', {
        '&-enter-active, &-leave-active': {
          transitionDuration: '80ms',
          transitionProperty: 'opacity, transform',
          transform: 'translateY(0)',
        },
        '&-enter, &-leave-to': {
          opacity: 0,
          transform: 'translateY(-10px)',
        },
      }),
    ];
  },
};

</script>
