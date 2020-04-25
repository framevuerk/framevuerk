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

<example>
@config state false
@config example false

<fvLayout>
  <!-- ... -->
  <!-- ... -->
  <!-- ... -->
  <!-- ... -->
</fvLayout>

</example>

<script>
import { dashCase } from '../utility/utils';

export default {
  props: {
    global: {
      type: Boolean,
      default: true,
    },
  },
  provide() {
    return {
      $layout: this,
    };
  },
  data() {
    return {
      eventEl: null,
      listeners: {
        scroll: [],
        resize: [],
      },
      localListeners: {
        scroll: this.onScroll,
        resize: this.onResize,
      },
      eventsData: {
        scroll: {
          last: 0,
          timeout: null,
        },
      },
      lockers: 0,
    };
  },
  mounted() {
    this.eventEl = this.global ? window : this.$el;
  },
  beforeDestroy() {
    (this.global ? window : this.$el).removeEventListener('scroll', this.localScrollListener);
  },
  methods: {
    on(eventType, listener, immediately = false) {
      const listeners = this.listeners[eventType];
      const localListener = this.localListeners[eventType];
      if (listeners.push(listener) === 1) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.eventEl.addEventListener(eventType, localListener);
            if (immediately) {
              localListener();
            }
          });
        });
      }
    },
    off(eventType, listener) {
      const listeners = this.listeners[eventType];
      const localListener = this.localListeners[eventType];
      listeners.splice(listeners.find((l) => listener));
      if (listeners.length === 0) {
        this.eventEl.removeEventListener(eventType, localListener);
      }
    },
    getSidebarPosition(sidebarComponent) {
      return (this.$slots['end-sidebar'] || []).includes(sidebarComponent.$vnode) ? 'end' : 'start';
    },
    cancelDetector(element, calback) {
      const layoutEl = (this.global ? window : this.$el);
      function onKeyDown(event) {
        if (event.which === 27) {
          callback();
        }
      }
      function onClick(event) {
        if (!element.contains(event.target)) {
          calback();
        }
      }
      setTimeout(() => {
        layoutEl.addEventListener('keydown', onKeyDown);
        layoutEl.addEventListener('click', onClick);
        layoutEl.addEventListener('touchstart', onClick);
        // focus on current
        const startFocusFor = element.querySelector('[autofocus]') || element;
        startFocusFor && startFocusFor.focus && startFocusFor.focus();
        // hide scroll
        (this.global ? document.body : this.$el).style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
        (this.global ? document.body : this.$el).style.overflow = 'hidden';
        this.lockers += 1;
      });
      return {
        release: () => {
          this.lockers -= 1;
          if (this.lockers < 1) {
            this.lockers = 0;
            (this.global ? document.body : this.$el).style.overflow = null;
            (this.global ? document.body : this.$el).style.paddingRight = null;
          }
          layoutEl.removeEventListener('keydown', onKeyDown);
          layoutEl.removeEventListener('click', onClick);
          layoutEl.removeEventListener('touchstart', onClick);
        },
      };
    },
    onScroll() {
      const el = (this.global ? document.scrollingElement : this.$el);
      const { scrollTop } = el;
      clearTimeout(this.eventsData.scroll.timeout);
      this.listeners.scroll.forEach((listener) => listener(scrollTop, scrollTop > this.eventsData.scroll.last ? 'down' : 'up'));
      this.eventsData.scroll.timeout = setTimeout(() => {
        this.eventsData.scroll.last = scrollTop;
      });
    },
    onResize() {
      const el = (this.global ? document.body : this.$el);
      const size = {
        width: el.offsetWidth,
        height: el.offsetHeight,
      };
      this.listeners.resize.forEach((listener) => listener(size));
    },
  },
  style({ className, mediaQuery }) {
    return [
      className('lock', {
        overflow: 'hidden',
      }),
      className('layout', {
        display: 'flex',
        flexDirection: 'column',
        overflow: this.global ? 'visible' : 'auto',
        width: '100%',
        position: 'relative',
        background: this.$theme.colors.background.normal,
        color: this.$theme.colors.background.text,
        minHeight: this.global ? '100vh' : 'auto',
        '& > main': {
          display: 'flex',
          maxWidth: '100%',
          overflowX: 'hidden',
          flexGrow: '1',
        },
      }),
    ];
  },
  inject: ['$theme'],
};
</script>
