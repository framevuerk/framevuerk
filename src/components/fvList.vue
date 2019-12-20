<template lang="pug">
ul.fv-list(:tabindex="tabindex", :data-parent="parent")
  slot(v-if="$scopedSlots.default || $slots.default")
</template>

<script>
import colorMixin from '../mixins/color.js';

export default {
  mixins: [
    colorMixin({
      color: 'background',
      activeColor: 'primary',
    }),
  ],
  props: {
    parent: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      highlighted: null,
      isFocused: false,
    };
  },
  computed: {
    tabindex() {
      return this.$attrs && this.$attrs.tabindex ? parseInt(this.$attrs.tabindex) : (this.parent ? 0 : undefined);
    },
  },
  methods: {
    onFocus() {
      this.isFocused = true;
    },
    onBlur() {
      this.isFocused = false;
      if (this.tabindex >= 0) {
        this.setHighlight(null);
      }
    },
    onLeave() {
      if (!this.isFocused) {
        this.setHighlight(null);
      }
    },
    setHighlight(el) {
      const allItems = [...this.$el.querySelectorAll('.fv-list-item')];
      allItems.forEach((li) => {
        if (li !== el) {
          li.classList.remove('highlighted');
        }
      });
      if (el) {
        el.classList.add('highlighted');
        el.__vue__.onHover();
      }
      this.highlighted = el;
    },
    moveHighlight(next = null) {
      const allItems = [...this.$el.querySelectorAll('.fv-list-item')].filter((el) => el.offsetHeight);
      const highlightedIndex = allItems.findIndex((el) => this.highlighted === el);
      let shouldHighlightIndex = highlightedIndex;
      let tryTime = 0;
      do {
        if (tryTime++ >= allItems.length) {
          this.highlighted = null;
          return;
        }
        if (next === true) {
          shouldHighlightIndex = (shouldHighlightIndex + 1) % allItems.length;
        } else if (next === false) {
          shouldHighlightIndex = shouldHighlightIndex - 1 < 0 ? allItems.length - 1 : shouldHighlightIndex - 1;
        } else {
          shouldHighlightIndex = 0;
        }
      } while (allItems[shouldHighlightIndex].__vue__ && allItems[shouldHighlightIndex].__vue__.disabled);
      this.setHighlight(allItems[shouldHighlightIndex]);
      if (typeof this.highlighted.scrollIntoViewIfNeeded === 'function') {
        this.highlighted.scrollIntoViewIfNeeded();
      }
    },
    onKeydown(event) {
      switch (event.which) {
        case 38: // up
          event.preventDefault();
          this.moveHighlight(false);
          break;
        case 40: // down
          event.preventDefault();
          this.moveHighlight(true);
          break;
        case process.env.direction === 'ltr' ? 37 : 39: // 37: left, 39: right,
          if (this.highlighted && this.highlighted.__vue__) {
            this.highlighted.__vue__.collapse();
          }
          break;
        case process.env.direction === 'ltr' ? 39 : 37: // 37: left, 39: right,
          if (this.highlighted && this.highlighted.__vue__) {
            this.highlighted.__vue__.expand();
          }
          break;
        case 13: // enter
          event.preventDefault();
          if (this.highlighted && this.highlighted.__vue__) {
            this.highlighted.__vue__.onClick(event);
          }
          break;
      }
    },
    onHover(event) {
      let el = event.target;
      while (el) {
        if (el && el.tagName === 'LI' && el.classList.contains('fv-list-item')) {
          break;
        }
        if (el.tagName === 'UL' && el.classList.contains('fv-list')) {
          return;
        }
        el = el.parentNode;
      }
      if (this.highlighted === el || el.getAttribute('disabled')) {
        return;
      }
      this.setHighlight(el);
    },
    bindEvents() {
      if (this.parent) {
        this.$el.addEventListener('mousemove', this.onHover);
        this.$el.addEventListener('mouseleave', this.onLeave);
        this.$el.addEventListener('keydown', this.onKeydown);
      }
      if (this.tabindex >= 0) {
        this.$el.addEventListener('focus', this.onFocus);
        this.$el.addEventListener('blur', this.onBlur);
      }
    },
    unbindEvents() {
      this.$el.removeEventListener('mouseleave', this.onLeave);
      this.$el.removeEventListener('mousemove', this.onHover);
      this.$el.removeEventListener('keydown', this.onKeydown);
      this.$el.removeEventListener('focus', this.onFocus);
      this.$el.removeEventListener('blur', this.onBlur);
    },
  },
  mounted() {
    this.bindEvents();
    // this.setHighlight(null)
  },
  beforeDestroy() {
    this.unbindEvents();
  },
};
</script>

<style lang="scss">
@import '../styles/variables';

.fv-list {
  clear: both;

  & > .fv-list-item:first-child > .content {
    border-top: none;
  }
}
</style>
