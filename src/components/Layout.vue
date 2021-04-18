<template>
  <div :class="$style.layout">
    <slot name="header" />
    <main>
      <slot name="start-sidebar" />
      <slot name="content" />
      <slot name="end-sidebar" />
    </main>
    <slot name="footer" />
  </div>
</template>

<docs src="./Layout.html" />

<script>
import { provideAs, inject } from '../utility/vue';
import color from '../mixins/color';

export default {
  mixins: [color('background')],
  ...provideAs('$layout'),
  ...inject('$theme'),
  data() {
    return {
      overlays: [],
    };
  },
  methods: {
    listen(eventName, handler, immediate = false) {
      const trueHandler = (event = null) => {
        const target = document.scrollingElement;
        if (eventName === 'scroll') {
          const { scrollTop } = document.scrollingElement;
          target.fvScrollDirection = scrollTop > (target.fvLastScrollTop || 0) ? 'down' : 'up';
          target.fvLastScrollTop = scrollTop;
          handler({
            event,
            direction: target.fvScrollDirection,
            scrollTop,
          });
        } else if (eventName === 'resize') {
          const { offsetWidth, offsetHeight } = document.scrollingElement;
          handler({
            event,
            width: offsetWidth,
            height: offsetHeight,
          });
        } else {
          handler({ event });
        }
      };
      window.addEventListener(eventName, trueHandler);
      if (immediate) {
        trueHandler();
      }
      return {
        release() {
          window.removeEventListener(eventName, trueHandler);
        },
      };
    },
  },
  style({ className }) {
    const $color = this.$theme.colors[this.$color];
    return [
      className('overlay', {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#00000020',
        zIndex: 2,
      }),
      className('layout', {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
        width: '100%',
        position: 'relative',
        background: $color.bg,
        color: $color.fg,
        minHeight: '100vh',
        '& > main': {
          display: 'flex',
          maxWidth: '100%',
          flexGrow: '1',
          alignItems: 'stretch',
        },
      }),
    ];
  },
};
</script>
