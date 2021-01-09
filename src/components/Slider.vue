<template>
  <div :class="$style.slider">
    <div class="labels">
      <custom-slot
        :uid="$.uid"
        component="SlideLabel"
      />
    </div>
    <div class="contents">
      <div
        ref="inner"
        class="inner"
      >
        <custom-slot
          :uid="$.uid"
          component="SlideContent"
          @update="setContents"
        />
      </div>
      <fvButton
        v-if="showButtons"
        fab
        class="btn prev"
        invert
        css-color="primary"
        css-border="no"
        css-shadow="no"
        @click="moveCurrent(-1)"
        v-text="$theme.direction.prevChar"
      />
      <fvButton
        v-if="showButtons"
        fab
        class="btn next"
        invert
        css-color="primary"
        css-border="no"
        css-shadow="no"
        @click="moveCurrent(1)"
        v-text="$theme.direction.nextChar"
      />
    </div>
  </div>
</template>

<doc>
@prop current @type Any @default undefined @description Current selected slide on viewport. Use this with .sync modifier.
@prop slidesPerPage @type Number @default 1 @description How many slides should visible on each view.
@prop showButtons @type Boolean @default false @description Show next/prev buttons at sides?
@prop swipeEvents @type Boolean @default true @description Handle swipe geastures to move slide to left/right.

@event update:current @params newValue @description Triggers when selected slide changes.

@slot label @description Use fvSlideLabel with this slot name in top of component content. Each `label` slot counts as one label/slide.
@slot content @description Use fvSlideContent with this slot name in component content just after defining `label`s.. Each `content` slot counts as one content/slide.
</doc>

<example>
@config title 'Default'
@config state true
@config example true

@data val = '1'
<fvSlider :current.sync="val" show-buttons>
  <fvSlideLabel slot="label" name="1"> One </fvSlideLabel>
  <fvSlideLabel slot="label" name="2"> Two </fvSlideLabel>
  <fvSlideLabel slot="label" name="3"> Three </fvSlideLabel>
  <fvSlideLabel slot="label" name="4"> Four </fvSlideLabel>

  <fvSlideContent slot="content" name="1" css-padding-y="xl" css-text-align="center" css-color="footer">
    <h2> Hiiii </h2>
    <h5> is this ok?! </h5>
  </fvSlideContent>
  <fvSlideContent slot="content" name="2" css-padding-y="xl" css-text-align="center" css-color="danger">
    <h2> Byeee </h2>
    <h5> is this not ok?! </h5>
  </fvSlideContent>
  <fvSlideContent slot="content" name="3" css-padding-y="xl" css-text-align="center" css-color="gray">
    <h2> Dumba </h2>
    <h5> dishdi dum?! </h5>
  </fvSlideContent>
  <fvSlideContent slot="content" name="4" css-padding-y="xl" css-text-align="center" css-color="background">
    <h2> Yayyy </h2>
    <h5> my eyes. my eyeeees! </h5>
  </fvSlideContent>
</fvSlider>
</example>

<script>
import { moveIndex } from '../utility/utils';
import findSlots from '../utility/findSlots';
import CustomSlot from './_CustomSlot.vue';
import Swipe from '../utility/swipe';

export default {
  name: 'Slider',
  inject: ['$theme'],
  emits: ['update:current'],
  components: {
    CustomSlot,
  },
  props: {
    // eslint-disable-next-line vue/require-prop-types
    current: {
      default: undefined,
    },
    slidesPerPage: {
      type: Number,
      default: 1,
    },
    showButtons: {
      type: Boolean,
      default: false,
    },
    swipeEvents: {
      type: Boolean,
      default: true,
    },
  },
  provide() {
    return {
      $slider: this,
    };
  },
  data() {
    return {
      swipe: null,
      contents: [],
    };
  },
  computed: {
    numberOfSlides() {
      return Math.ceil(this.contents.length / this.slidesPerPage);
    },
    eachTabSize() {
      return this.contents.length / (this.numberOfSlides * 100);
    },
    currentIndex() {
      return this.current ? this.contents.findIndex((content) => content === this.current) : 0;
    },
    currentTransform() {
      const factor = this.$theme.direction.leftFactor * -1;
      return factor * (this.currentIndex * (100 / this.contents.length));
    },
  },
  watch: {
    current() {
      this.resetTransform();
    },
    swipeEvents: {
      handler(value) {
        this.setSwipeEvents(value);
      },
      immediate: true,
    },
    contents(newContents) {
      console.log('contents changed');
      if (!newContents.includes(this.current)) {
        this.setCurrent(newContents[0]);
      }
      this.$nextTick(() => {
        this.$refs.inner.style.width = `${this.numberOfSlides * 100}%`;
        this.resetTransform(true);
      });
    },
  },
  beforeUnmount() {
    this.setSwipeEvents(false);
  },
  methods: {
    setContents(contents) {
      this.contents = contents.map((item) => item.props.name);
    },
    setSwipeEvents(active) {
      this.$nextTick(() => {
        if (active) {
          this.swipe = new Swipe(this.$refs.inner);
          this.swipe.before(this.beforeSwipe);
          this.swipe.while(this.whileSwipe);
          this.swipe.after(this.afterSwipe);
          this.swipe.on();
        } else if (this.swipe) {
          this.swipe.off();
        }
      });
    },
    resetTransform(withoutTransition = false) {
      if (withoutTransition) {
        this.$refs.inner.style.transitionDuration = '0s';
        setTimeout(() => {
          this.$refs.inner.style.transitionDuration = null;
        });
      }
      this.$refs.inner.style.transform = `translateX(${this.currentTransform}%)`;
    },
    moveIndex(offset) {
      const max = this.contents.length - (this.slidesPerPage - 1);
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
      // eslint-disable-next-line no-nested-ternary
      const offsetIndex = this.$theme.direction.leftFactor * (diff.x < -100 ? 1 : (diff.x > 100 ? -1 : 0));
      const newIndex = this.moveIndex(offsetIndex);
      const newValue = this.contents[newIndex];
      if (newIndex === this.currentIndex) {
        this.resetTransform();
      }
      this.setCurrent(newValue);
    },
    setCurrent(value) {
      this.$emit('update:current', value);
    },
    moveCurrent(offset) {
      this.$emit('update:current', this.contents[this.moveIndex(offset)]);
    },
  },
  style({ className }) {
    return [
      className('slider', {
        '& > .labels': {
          position: 'relative',
          display: 'flex',
          flexDirection: 'row',
          borderBottomWidth: '1px',
          borderBottomColor: this.$theme.colors.background.shade(-13),
        },
        '& > .contents': {
          position: 'relative',
          overflow: 'hidden',
          '& > .btn': {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            '&.next': {
              [this.$theme.direction.end]: 0,
            },
            '&.prev': {
              [this.$theme.direction.start]: 0,
            },
          },
          '& > .inner': {
            display: 'flex',
            flexDirection: 'row',
            // width: `${this.numberOfSlides * 100}%`,
            transition: 'transform 230ms',
            willChange: 'transform',
          },
        },
      }),
    ];
  },
};
</script>
