<template>
  <div :class="$style.layout">
    <custom-slot
      :uid="$.uid"
      component="Header"
    />
    <main>
      <custom-slot
        :uid="$.uid"
        component="Sidebar"
        :custom-check="checkIfSidebar('start')"
      />
      <custom-slot
        :uid="$.uid"
        component="Content"
      />
      <custom-slot
        :uid="$.uid"
        component="Sidebar"
        :custom-check="checkIfSidebar('end')"
      />
    </main>
    <custom-slot
      :uid="$.uid"
      component="Footer"
    />
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
import CustomSlot from './_CustomSlot.vue';

export default {
  name: 'Layout',
  components: {
    CustomSlot,
  },
  provide() {
    return {
      $layout: this,
    };
  },
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
          clearTimeout(target.fvScrollTimeout);
          target.fvScrollDirection = scrollTop > (target.fvLastScrollTop || 0) ? 'down' : 'up';
          target.fvScrollTimeout = setTimeout(() => {
            target.fvLastScrollTop = scrollTop;
            handler({
              event,
              direction: target.fvScrollDirection,
              scrollTop,
            });
          });
        } else if (eventName === 'resize') {
          clearTimeout(target.fvResizeTimeout);
          target.fvResizeTimeout = setTimeout(() => {
            const { offsetWidth, offsetHeight } = document.scrollingElement;
            handler({
              event,
              width: offsetWidth,
              height: offsetHeight,
            });
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
    checkIfSidebar(position) {
      return (slot) => (slot.props && slot.props.position === position);
    },
  },
  style({ className }) {
    return [
      className('overlay', {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        zIndex: 1,
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
          flexGrow: '1',
        },
      }),
    ];
  },
  inject: ['$theme'],
};
</script>
