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

<doc>
@slot header @description Header section. By default you need to set this slot on your fvHeader component.
@slot content @description Content section. By default you need to set this slot on your fvContent component.
@slot footer @description Footer section. By default you need to set this slot on your fvFooter component.
@slot start-sidebar @description Sidebar section. In ltr mode this is renders on left. Behavior is based on main direction. By default you need to set this slot on your fvSidebar component.
@slot end-sidebar @description Sidebar section. In ltr mode this is renders on right. Behavior is based on main direction. By default you need to set this slot on your fvSidebar component.

</doc>

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
export default {
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
  beforeDestroy() {
    window.removeEventListener('scroll', this.localScrollListener);
  },
  methods: {
    on(eventType, listener, immediately = false) {
      const listeners = this.listeners[eventType];
      const localListener = this.localListeners[eventType];
      if (listeners.push(listener) === 1) {
        this.$nextTick(() => {
          setTimeout(() => {
            window.addEventListener(eventType, localListener);
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
      listeners.splice(listeners.findIndex((l) => l === listener), 1);
      if (listeners.length === 0) {
        window.removeEventListener(eventType, localListener);
      }
    },
    getSidebarPosition(sidebarComponent) {
      return (this.$slots['end-sidebar'] || []).includes(sidebarComponent.$vnode) ? 'end' : 'start';
    },
    cancelDetector(element, callback) {
      function onKeyDown(event) {
        if (event.which === 27) {
          callback();
        }
      }
      function onClick(event) {
        if (!element.contains(event.target)) {
          callback();
        }
      }
      setTimeout(() => {
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('click', onClick);
        window.addEventListener('touchstart', onClick);
        // focus on current
        const startFocusFor = element.querySelector('[autofocus]') || element;
        if (startFocusFor && startFocusFor.focus) {
          startFocusFor.focus();
        }
        // hide scroll
        document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
        document.body.style.overflow = 'hidden';
        this.lockers += 1;
      });
      return {
        release: () => {
          this.lockers -= 1;
          if (this.lockers < 1) {
            this.lockers = 0;
            document.body.style.overflow = null;
            document.body.style.paddingRight = null;
          }
          window.removeEventListener('keydown', onKeyDown);
          window.removeEventListener('click', onClick);
          window.removeEventListener('touchstart', onClick);
        },
      };
    },
    onScroll() {
      const { scrollTop } = document.scrollingElement;
      clearTimeout(this.eventsData.scroll.timeout);
      this.listeners.scroll.forEach((listener) => listener(scrollTop, scrollTop > this.eventsData.scroll.last ? 'down' : 'up'));
      this.eventsData.scroll.timeout = setTimeout(() => {
        this.eventsData.scroll.last = scrollTop;
      });
    },
    onResize() {
      const el = document.scrollingElement;
      const size = {
        width: el.offsetWidth,
        height: el.offsetHeight,
      };
      this.listeners.resize.forEach((listener) => listener(size));
    },
  },
  style({ className }) {
    return [
      className('lock', {
        overflow: 'hidden',
      }),
      className('layout', {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
        width: '100%',
        position: 'relative',
        background: this.$theme.colors.background.normal,
        color: this.$theme.colors.background.text,
        minHeight: '100vh',
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
