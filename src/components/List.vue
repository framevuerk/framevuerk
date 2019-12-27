<template>
<component :is="tag" :tabindex="controlerElement ? -1 : 0">
  <slot />
</component>
</template>

<script>
import color from '../mixins/color';

export default {
  mixins: [color],
  inject: ['$theme'],
  props: {
    tag: {
      type: String,
      default: 'ul',
    },
    controlerElement: {
      type: Object,
      default: undefined,
    }
  },
  computed: {
    eventListener() {
      return this.controlerElement || this.$el;
    }
  },
  data() {
    return {
      highlighted: null,
      isFocused: false,
    };
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
        // case 13: // enter
        //   event.preventDefault();
        //   if (this.highlighted && this.highlighted.__vue__) {
        //     this.highlighted.__vue__.onClick(event);
        //   }
        //   break;
      }
    },
    bindEvents() {
      this.eventListener.addEventListener('keydown', this.onKeydown);
    },
    unbindEvents() {
      this.eventListener.removeEventListener('keydown', this.onKeydown);
    },
  },
  mounted() {
    this.bindEvents();
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
