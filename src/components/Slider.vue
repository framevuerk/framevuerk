<template>
<div :class="$style.slider">
  <div class="labels">
    <slot name="label"/>
  </div>
  <div class="contents">
    <div class="inner" ref="inner">
      <slot name="slide"/>
    </div>
    <fvButton v-if="showButtons" fab class="btn prev" v-text="$theme.direction.prevChar" invert css-color="primary" css-border="no" css-shadow="no"/>
    <fvButton v-if="showButtons" fab class="btn next" v-text="$theme.direction.nextChar" invert css-color="primary" css-border="no" css-shadow="no"/>
  </div>
</div>
</template>

<script>
import { moveIndex } from '@/utility/utils';
import Swipe from '@/utility/swipe';

export default {
  props: {
    current: {
      default: undefined,
    },
    slidesPerPage: {
      type: Number,
      default: 2,
    },
    showNavs: {
      type: Boolean,
      default: true,
    },
    showButtons: {
      type: Boolean,
      default: true,
    },
  },
  provide() {
    return {
      $tab: this,
    };
  },
  data() {
    return {
      swipe: null,
    };
  },
  mounted() {
    this.swipe = new Swipe(this.$refs.inner);
    this.swipe.before(this.beforeSwipe);
    this.swipe.while(this.whileSwipe);
    this.swipe.after(this.afterSwipe);
    this.swipe.on();
  },
  beforeDestroy() {
    this.swipe.off();
  },
  methods: {
    resetTransform() {
      this.$refs.inner.style.transform = `translateX(${this.currentTransform}%)`;
    },
    moveIndex(offset) {
      const max = this.numberOfTabs - (this.slidesPerPage - 1);
      return moveIndex(this.currentIndex + offset, max);
    },
    beforeSwipe() {
      this.$refs.inner.style.transitionDuration = '0s';
    },
    whileSwipe(pos, diff) {
      this.$refs.inner.style.transform = `translateX(calc(${this.currentTransform}% + ${diff.x}px))`;
    },
    afterSwipe(pos, diff) {
      this.$refs.inner.style.transitionDuration = null;
      const offsetIndex = this.$theme.direction.leftFactor * (diff.x < -100 ? 1 : (diff.x > 100 ? -1 : 0));
      const newIndex = this.moveIndex(offsetIndex);
      const newValue = this.$slots.slide[newIndex].componentOptions.propsData.name;
      if (newIndex === this.currentIndex) {
        this.resetTransform();
      }
      this.$emit('update:current', newValue);
    },
  },
  computed: {
    numberOfTabs() {
      return this.$slots.slide.length;
    },
    numberOfSlides() {
      return Math.ceil(this.numberOfTabs / this.slidesPerPage);
    },
    eachTabSize() {
      return this.numberOfTabs / (this.numberOfSlides * 100);
    },
    currentIndex() {
      return this.current ? this.$slots.slide.findIndex((slide) => slide.componentOptions.propsData.name === this.current): 0;
    },
    currentTransform() {
      const factor = this.$theme.direction.leftFactor * -1;
      return factor * (this.currentIndex * (100 / this.numberOfTabs));
    },
  },
  style({ className, mediaQuery }) {
    return [
      className('slider', {
        '& > .labels': {
          position: 'relative',
        },
        '& > .contents': {
          position: 'relative',
          overflow: 'hidden',
          border: 'solid 1px red',
          '& > .btn': {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            '&.next': {
              [this.$theme.direction.end]: 0,
            },
            '&.prev': {
              [this.$theme.direction.start]: 0,
            }
          },
          '& > .inner': {
            display: 'flex',
            width: `${this.numberOfSlides * 100}%`,
            transition: 'transform 180ms',
            willChange: 'transform',
          },
        }
      }),
    ];
  },
  watch: {
    current() {
      this.resetTransform();
    },
  },
  inject: ['$theme'],
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
  //               transform: `translateX(${this.$theme.direction.ltrFactor * -100}%)`
  //             }
  //           }
  //         }
  //       },
  //     }),
  //     mediaQuery({maxWidth: '767px'}, [
  //       className('layout', {
  //         '& > main > aside.auto': {
  //           position: 'fixed',
  //           transform: `translateX(${this.$theme.direction.ltrFactor * -100}%) !important`,
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
};
</script>
