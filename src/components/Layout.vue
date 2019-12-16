<xtemplate>
<div :class="[$style.layout, global ? 'global' : '']">
  <header v-if="$slots.header" class="normal" ref="header">
    <slot name="header"/>
  </header>
  <header v-if="$slots.autohideHeader" class="autohide" ref="autohideHeader">
    <slot name="autohideHeader"/>
  </header>
  <main ref="main">
    <aside ref="sidebar" :class="[sc, sc !== 'auto' ? (sv ? 'show' : 'hide') : '']">
      <slot name="sidebar"/>
    </aside>
    <div class="content" ref="content">
      <slot name="content"/>
    </div>
  </main>
  <footer :class="footer">
    <slot name="footer"/>
  </footer>
</div>
</xtemplate>

<script>
import { each, shadeColor, colorLightness, hexToRgb, rgbToText, getElementPosition } from '@/utility/utils';
import parent from '@/utility/parent';
  
export default {
  props: {
    global: {
      type: Boolean,
      default: true,
    }
  },
  provide() {
    return {
      $layout: {
        onScroll: this.onScroll,
        offScroll: this.offScroll,
        $el: this.$el,
      }
    }
  },
  render(createElement) {
    const headers = this.$slots.default.filter(vnode => vnode.componentOptions && vnode.componentOptions.tag === 'fvHeader');
    const footer = this.$slots.default.find(vnode => vnode.componentOptions && vnode.componentOptions.tag === 'fvFooter');
    const sidebar = this.$slots.default.find(vnode => vnode.componentOptions && vnode.componentOptions.tag === 'fvSidebar');
    const content = this.$slots.default.find(vnode => vnode.componentOptions && vnode.componentOptions.tag === 'fvContent');
    return createElement(
      'div',
      [].concat(
        headers,
        createElement('main', {
          ref: 'main',
        }, [
          sidebar,
          content,
        ]),
        footer,
      )
    )
  },
  data() {
    return {
      scrollListeners: [],
      lastScrollPosition: 0,
      lastScrollTimeout: null,
    };
  },
  beforeDestroy () {
    (this.global ? window : this.$el).removeEventListener('scroll', this.localScrollListener);
  },
  methods: {
    onScroll(listener) {
      this.scrollListeners.push(listener);
      if (this.scrollListeners.length === 1) {
        this.$nextTick(() => {
          setTimeout(() => {
            (this.global ? window : this.$el).addEventListener('scroll', this.localScrollListener);
          });
        });
      }
    },
    offScroll(listener) {
      this.scrollListeners.splice(this.scrollListeners.find((l) => listener));
      if (this.scrollListeners.length === 0) {
        this.$nextTick(() => {
          (this.global ? window : this.$el).addEventListener('scroll', this.localScrollListener);
        });
      }
    },
    localScrollListener() {
      const el = (this.global ? document.scrollingElement : this.$el);
      const scrollTop = el.scrollTop;
      clearTimeout(this.lastScrollPosition);
      this.lastScrollTimeout = setTimeout(() => {
        this.lastScrollPosition = scrollTop;
      });
      this.scrollListeners.forEach(listener => listener(scrollTop, scrollTop > this.lastScrollPosition ? 'down' : 'up'));
    }
  }
  // props: {
  //   global: {
  //     type: Boolean,
  //     default: true,
  //   },
  //   header: {
  //     type: String,
  //     validator: v => ['normal', 'fixed', 'autohide', 'overlay'].includes(v),
  //     default: 'autohide',
  //   },
  //   footer: {
  //     type: String,
  //     validator: v => ['normal', 'fixed', 'overlay'].includes(v),
  //     default: 'normal',
  //   },
  //   sidebar: {
  //     type: String,
  //     validator: v => ['pinned', 'unattached', 'auto'].includes(v),
  //     default: 'auto',
  //   }
  // },
  // inject: ['$theme'],
  // data() {
  //   return {
  //     // scrolling element
  //     se: null, // calc on run-time
  //     // scroll listener element
  //     sl: null, // calc on run-time
  //     // scroll direction
  //     sd: 'up',
  //     // last scroll position
  //     lsp: Infinity,
  //     // sidebar visibility
  //     sv: true,
  //     // sidebar class
  //     sc: this.sidebar,
  //   }
  // },
  // methods: {
  //   onScroll(event) {
  //     if (this.se.scrollTop < this.$refs.autohideHeader.offsetHeight) {
  //       this.$refs.autohideHeader.classList.remove('hide');
  //       return
  //     }
  //     console.log('here')
  //     this.sd = this.se.scrollTop > this.lsp ? 'down' : 'up';
  //     this.lsp = this.se.scrollTop;
  //     if (this.sd === 'down') {
  //       this.$refs.autohideHeader.classList.add('hide');
  //     } else {
  //       this.$refs.autohideHeader.classList.remove('hide');
  //     }
  //   },
  //   sidebarAutoState() {
  //     return document.body.offsetWidth < 768 ? 'unattached' : 'pinned';
  //   },
  //   sidebarResizeHandler() {
  //     parent.unlock();
  //     parent.off('outsideclick', this.$refs.sidebar, this.toggleSidebar);
  //     if (document.body.offsetWidth < 768) {
  //       this.sv = false;
  //       this.sc = 'unattached';
  //     } else {
  //       this.sv = true;
  //       this.sc = 'pinned';
  //     }
  //   },
  //   toggleSidebar() {
  //     this.sv = !this.sv;
  //     if (this.sv && this.sc === 'unattached') {
  //       parent.lock();
  //       setTimeout(() => {
  //         parent.on('outsideclick', this.$refs.sidebar, this.toggleSidebar);
  //       })
  //     } else {
  //       parent.unlock();
  //       parent.off('outsideclick', this.$refs.sidebar, this.toggleSidebar);
  //     }
  //   },
  //   sidebarToggleHandler(event) {
  //     let e = event.target;
  //     while (e !== this.$el) {
  //       if (e.hasAttribute('data-sidebar-toggle')) {
  //         this.toggleSidebar();
  //         return;
  //       }
  //       e = e.parentElement;
  //     }
  //   }
  // },
  // created () {
  //   if (this.sidebar === 'unattached') {
  //     this.sv = false;
  //   }
  // },
  // mounted () {
  //   this.se = this.global ? document.scrollingElement : this.$el;
  //   this.sl = this.global ? window : this.$el;
  //   if (this.$slots.autohideHeader) {
  //     setTimeout(() => {
  //       this.sl.addEventListener('scroll', this.onScroll);
  //     }, 120)
  //   }
  //   this.$nextTick(() => {
  //     this.$el.addEventListener('click', this.sidebarToggleHandler);
  //   });
  //   if (this.sidebar === 'auto') {
  //     const newState = this.sidebarAutoState();
  //     if (newState === 'unattached') {
  //       this.sv = false
  //     }
  //     this.sc = newState;
  //     parent.on('sizechange', this.sidebarResizeHandler);
  //   }
  // },
  // beforeDestroy () {
  //   this.sl.removeEventListener('scroll', this.onScroll);
  //   this.$el.removeEventListener('click', this.sidebarToggleHandler);
  // },
  // style({ className, mediaQuery }){
  //   return [
  //     className('layout', {
  //       // overflow: 'hidden',
  //       border: 'solid 1px red',
  //       minHeight: '100%',
  //       display: 'flex',
  //       flexDirection: 'column',
  //       '&.global': {
  //         minHeight: '100vh',
  //       },
  //       '& > header': {
  //         backgroundColor: this.$theme.colors.primary.normal,
  //         '&.autohide': {
  //           width: '100%',
  //           position: 'sticky',
  //           top: '0',
  //           transform: 'translateY(0)',
  //           transition: `transform 200ms linear`,
  //           willChange: 'transform',
  //           '&.hide': {
  //             transform: 'translateY(-100%)',
  //           }
  //         }
  //       },
  //       '& > main': {
  //         flexGrow: '1',
  //         display: 'flex',
  //         flexDirection: 'row',
  //         '& > .content': {
  //           flexGrow: '1',
  //         },
  //         '& > .sidebar-overlay': {
  //           position: 'fixed',
  //           top: '0',
  //           left: '0',
  //           width: '100%',
  //           height: '100%',
  //           backgroundColor: this.$theme.colors.background.shade(-20, 0.1),
  //         },
  //         '& > aside': {
  //           overflow: 'hidden',
  //           backgroundColor: 'red',
  //           transition: `transform ${this.$theme.speed.normal} ease`,
  //           '&.pinned': {
  //             transition: `max-width ${this.$theme.speed.normal} ease`,
  //             '&.show': {
  //               width: 'auto',
  //               maxWidth: '360px',
  //             },
  //             '&.hide': {
  //               maxWidth: '0px',
  //             }
  //           },
  //           '&.unattached': {
  //             position: 'fixed',
  //             transition: `transform ${this.$theme.speed.normal} ease`,
  //             top: '0',
  //             height: '100vh',
  //             zIndex: '2',
  //             '&.show': {
  //               transform: `translateX(0) !important`
  //             },
  //             '&.hide': {
  //               transform: `translateX(${this.$theme.direction.leftFactor * -100}%)`
  //             }
  //           }
  //         }
  //       },
  //     }),
  //     mediaQuery({maxWidth: '767px'}, [
  //       className('layout', {
  //         '& > main > aside.auto': {
  //           position: 'fixed',
  //           transform: `translateX(${this.$theme.direction.leftFactor * -100}%) !important`,
  //         }
  //       })
  //     ]),
  //     mediaQuery({minWidth: '768px'}, [
  //       className('layout', {
  //         '& > main > aside.auto': {
  //           width: 'auto',
  //         }
  //       })
  //     ])
  //   ]
  // },
}
</script>